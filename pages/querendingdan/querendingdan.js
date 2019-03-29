// pages/querendingdan/querendingdan.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    needDelivery: true,
    deliveryFee: 0,
      address:{
        id:1,
        name:'王某某',
        tel:'199****9999',
        addr:'北京市海淀区西二旗珠江摩尔国际大厦3号楼'
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
            txt:'待处理',
            val:200,
            color: 0
          },
        amount:{
            tit:'订单金额',
            val:'￥0.00',
            color: 1
          },
        goods:[
          {
            goodsId:1,
            name:"现货油桃5斤黄油桃新鲜孕妇水果大连特产桃子非水蜜桃黄桃蟠桃",
            unit:'10kg/箱',
            price: 69.00,
            num:3,
            picUrl:'../../images/j-i2.jpg'
          },
          {
            goodsId:1,
            name: "现货油桃5斤黄油桃新鲜孕妇水果大连特产桃子非水蜜桃黄桃蟠桃",
            unit: '10kg/箱',
            price: 69.00,
            num: 3,
            picUrl: '../../images/j-i2.jpg'
          }
        ],
        remark:'',
        deliveryId:0,
        shopAddressId:0,
      },
    remarkFocus: false
  },

  onLoad: function (options){
    //TODO:等后台地址接口完成后，获取默认地址
    this.data.goods = app.orderGoods;
    this.setData({order:this.data.order})
  },

  onShow: function (e){
    if (this.data.needDelivery) {
      //goods info
      var detail=[];
      var that = this;
      this.data.goods.forEach(v=>{
        detail.push({ cash: v.price * v.num, goodsId: v.goodsId+'',num:v.num})
      })
      //request api
      app.request('/customer/order/delivery/cash', 'post', {
        addressId: this.data.address.id,
        detail:detail,
        openId:app.openid
      }, function (e) {
        console.log(e);
        if(e.result){
            that.setData({ deliveryFee: parseFloat(e.data)})
          } 
      })
    } else {
      this.data.deliveryFee = 0;
    }
  },

  onRemark: function(){
    this.setData({remarkFocus:true})
  },

  onHelp: function(){
    wx.navigateTo({
      url: '/pages/bangzhuye/bangzhuye',
    })
  },
  
  onSubmit:function(){}
})