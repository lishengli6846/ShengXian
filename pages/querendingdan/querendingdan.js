// pages/querendingdan/querendingdan.js
const app = getApp();
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showRemarkBtn: true,
    needDelivery: false,
    deliveryFee: 0,
    orderNo:'',
    address:{
      id:0,
      name:'',
      tel:'',
      addr:''
    },
    order:{
      number:{
          tit:'订单单号',
          val:'',
          color: 0
        },
      time:{
          tit:'下单时间',
          val:'',
          color: 0
        },
      status:{
          tit:'订单状态',
          txt:'',
          val:200,
          color: 0
        },
      amount:{
          tit:'订单金额',
          val:'',
          color: 1
        },
      remark:'',
      deliveryId:0,
      shopAddressId:0,
      orderStatus:'100'
    },
    goods: [
      // {
      //   goodsId:1,
      //   name:"现货油桃5斤黄油桃新鲜孕妇水果大连特产桃子非水蜜桃黄桃蟠桃",
      //   unit:'10kg/箱',
      //   price: 69.00,
      //   num:3,
      //   picUrl:'../../images/j-i2.jpg'
      // },
      // {
      //   goodsId:1,
      //   name: "现货油桃5斤黄油桃新鲜孕妇水果大连特产桃子非水蜜桃黄桃蟠桃",
      //   unit: '10kg/箱',
      //   price: 69.00,
      //   num: 3,
      //   picUrl: '../../images/j-i2.jpg'
      // }
    ],
    remarkFocus: false
  },

  onLoad: function (options){
    if(options.orderno){
      //加载指定订单
      var that= this
      app.request('/customer/order/show','post',{openId: app.openid, orderNo: options.orderno},function(re){
        if(re.result){
          that.setData({
            orderNo: re.data.orderNo,
            address:{
              id:1,
              name: re.data.consigneeName,
              tel: re.data.consigneePhone,
              addr: re.data.address
            },
            order:{
              number: {
                tit: '订单单号',
                val: re.data.orderNo,
                color: 0
              },
              time: {
                tit: '下单时间',
                val: re.data.createTime,
                color: 0
              },
              status: {
                tit: '订单状态',
                txt: re.data.orderStatus == "100" ? "待处理" : (re.data.orderStatus == "600" ? "已完成" : (re.data.orderStatus == "700" ? "已关闭":"")),
                val: 200,
                color: 0
              },
              amount: {
                tit: '订单金额',
                val: re.data.goodsCash,
                color: 1
              },
              remark: re.data.remark,
              deliveryId: 0,
              shopAddressId: 0,
              orderStatus:re.data.orderStatus
            },
            showRemarkBtn: (re.data.remark=='' || re.data.remark==null),
            goods: re.data.details
          })
        }
      },'application/x-www-form-urlencoded')
    }
    else{
      wx.showLoading({
        title: '正在处理',
      })
      //从全局参数取商品信息
      this.data.goods = app.orderGoods;
      this.data.needDelivery = app.orderNeedDelivery;
      this.data.deliveryFee = app.orderDeliveryFee;
      this.setData({ goods: app.orderGoods })
      //获取默认地址
      var that = this;
      app.request('/customer/address/list', 'post', { pageNum: 1,pageSize:100, search: { openId: app.openid } }, function (re) {
        console.log(re)
        re.data.list.forEach(v => {
          if (v.status == '10') { 
            that.setData({ 
                address:{
                  id: v.addressId,
                  name: v.consigneeName,
                  tel: v.consigneePhone,
                  addr: v.address
                } 
            })
          }
        });
        if(that.data.address.id==0 && re.data.list.length>0){
          that.setData({
            address: {
              id: re.data.list[0].addressId,
              name: re.data.list[0].consigneeName,
              tel: re.data.list[0].consigneePhone,
              addr: re.data.list[0].address
            }
          })
        }
        
        that.createOrder();
      })
    }
  },

  createOrder: function(){
    //创建订单
    var list = [];
    var that = this;
    this.data.goods.forEach(v => {
      if (v.isChecked) {
        list.push({
          goodsId: v.goodsId,
          num: v.num,
          type: 'num'
        })
      }
    })
    app.request('/customer/order/create', 'post', {
      deliveryId: this.data.address.id,
      goodsList: list,
      openId: app.openid
    }, function (re) {
      if (re.result) {
        that.data.orderNo = re.data;
        that.loadOrderDetail(re.data);  //data中的值是单号
      } else {
        wx.showToast({
          title: re.message,
          icon: 'none'
        })
      }
      wx.hideLoading()
    })

    this.setData({ order: this.data.order })
  },

  loadOrderDetail:function(orderNo){
    this.data.order.number.val = orderNo
    this.data.order.time.val = util.formatTime(new Date())
    this.data.order.status.txt = '下单成功'
    this.data.order.amount.val = '￥'+ util.calculateMoneyAndFormat(this.data.goods)
    this.setData({ 
      order:this.data.order
    })
  },

  onShow: function (e){
    // 运费计算由首页完成
    // if (this.data.needDelivery) {
    //   //goods info
    //   var detail=[];
    //   var that = this;
    //   this.data.goods.forEach(v=>{
    //     detail.push({ cash: v.price * v.num, goodsId: v.goodsId+'',num:v.num})
    //   })
    //   //request api
    //   app.request('/customer/order/delivery/cash', 'post', {
    //     addressId: this.data.address.id,
    //     detail:detail,
    //     openId:app.openid
    //   }, function (e) {
    //     console.log(e);
    //     if(e.result){
    //         that.setData({ deliveryFee: parseFloat(e.data)})
    //       } 
    //   })
    // } else {
    //   this.data.deliveryFee = 0;
    // }
  },

  remarkInput:function(e){
    this.setData({remark:e.detail.value})
  },

  onRemark: function(){
    if(this.data.remark==null || this.data.remark==''){
      this.setData({remarkFocus:true})
    }else{
      var that = this
      app.request('/customer/order/postscript','post',{
        openId:app.openid,
        orderNo:this.data.orderNo,
        remark:this.data.remark
      },function(re){
        if(re.result){
          wx.showToast({
            title: '留言成功',
          })
          that.setData({showRemarkBtn: false})
        }else{
          wx.showToast({
            title: re.message,
            icon: 'none'
          })
        }
      },
      'application/x-www-form-urlencoded')
    }
  },

  onHelp: function(){
    wx.navigateTo({
      url: '/pages/bangzhuye/bangzhuye',
    })
  },
  
  onSubmit:function(){}
})