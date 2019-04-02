// pages/zhuye/zhuye.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:[],
    selectedGoods: [],
    categoryId: 1,
    curGood:null,
    curNum: 0,
    curAmount: 0,
    scrollHeight: '600rpx',//(wx.getSystemInfoSync().windowHeight+30)+
    needDelivery: false,
    deliveryFee: 0,
    allowDelivery: false
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideTabBar({
    })
console.log('scrollHeight:'+this.data.scrollHeight)
  },

  loadSearchResult: function(re){
    var list=[];
    console.log(re);
    var that = this;
    re.data.forEach(v => {
      app.request('/customer/goods/detail', 'post', { goodsId: v.id }, function (r) {
         list.push(r.data);
         that.setData({ goods: list })
      },'application/x-www-form-urlencoded')
      });
  },

  loadCategoryList: function(re){
    if(re.result){
      //TODO:未引入分页功能，后台暂无分页参数
      var list = [
      //   {
      //   goodsId: 101,
      //   picUrl: '../../images/j-i10.png',
      //   name: '现货油桃500g',
      //   price: '6.99'
      // }, {
      //     goodsId: 101,
      //     picUrl: '../../images/j-i10.png',
      //     name: '现货油桃500g',
      //     price: '6.99'
      //   }, {
      //     goodsId: 101,
      //     picUrl: '../../images/j-i10.png',
      //     name: '现货油桃500g',
      //     price: '6.99'
      //   }, {
      //     goodsId: 101,
      //     picUrl: '../../images/j-i10.png',
      //     name: '现货油桃500g',
      //     price: '6.99'
      //   }, {
      //     goodsId: 101,
      //     picUrl: '../../images/j-i10.png',
      //     name: '现货油桃500g',
      //     price: '6.99'
      //   }, {
      //     goodsId: 101,
      //     picUrl: '../../images/j-i10.png',
      //     name: '现货油桃500g',
      //     price: '6.99'
      //   }, {
      //     goodsId: 101,
      //     picUrl: '../../images/j-i10.png',
      //     name: '现货油桃500g',
      //     price: '6.99'
      //   }, {
      //     goodsId: 101,
      //     picUrl: '../../images/j-i10.png',
      //     name: '现货油桃500g',
      //     price: '6.99'
      //   }, {
      //     goodsId: 101,
      //     picUrl: '../../images/j-i10.png',
      //     name: '现货油桃500g',
      //     price: '6.99'
      //   }, {
      //     goodsId: 101,
      //     picUrl: '../../images/j-i10.png',
      //     name: '现货油桃500g',
      //     price: '6.99'
      //   }
        ];
      re.data.list.forEach(v=>{list.push(v)});
      this.setData({goods:list});
    }
  },

  deliveryCheckboxChange: function(e){
    // console.log(e)
    this.setData({ needDelivery: e.detail.value.length > 0})
    
  },

  setSelectedGood: function(data){
    var index = data.currentTarget.dataset.index;
    if(this.data.goods.length > index && index>=0){
      var good = this.getItemFromSelectedGoods(this.data.goods[index].goodsId);
      if(good==null){
        good = this.data.goods[index];
        this.data.curNum=0;
        this.data.curAmount=0;
        good.num=0;
        good.money=0;
      }else{
        this.data.curNum = good.num
        this.data.curAmount = good.money
      }
      this.setData({curGood: good, curNum:this.data.curNum, curAmount:this.data.curAmount, scrollHeight:'480rpx'})
    }

    //计算运费(目前只适配是否启用配送功能)
    var detail = [];
    var that = this;
    this.data.selectedGoods.forEach(v => {
      detail.push({ cash: v.price * v.num, goodsId: v.goodsId + '', num: v.num })
    })
    app.request('/customer/order/delivery/cash', 'post', {
      addressId: 1,
      detail: detail,
      openId: app.openid
    }, function (e) {
      console.log(e);
      if (e.result) {
        that.setData({ allowDelivery: e.data.allow, deliveryFee: e.data.deliveryCash })
      }
    })
  },

  curNumPlus:function(){
    var num = this.data.curNum + 1;
    this.setData({curNum:num,curAmount:this.data.curGood.price*num});
    this.updateOrderList();
  },
  curNumReduce: function () { 
    var num = (this.data.curNum - 1 > 0 ? this.data.curNum - 1 : 0);
    this.setData({ curNum: num, curAmount: this.data.curGood.price * num});
    this.updateOrderList();
  },
  curNumEdited: function (event) { 
    var num = event.detail.value;
    this.setData({ curNum: num, curAmount: this.data.curGood.price * num });
    this.updateOrderList();
  },
  curAmountPlus: function () { 
    var am = this.data.curAmount + 10;
    var num = Math.ceil(am/this.data.curGood.price);
    am = num*this.data.curGood.price;
    this.setData({ curAmount: am,curNum:num});
    this.updateOrderList();
  },
  curAmountReduce: function () {
    var am = this.data.curAmount - 10 > 0 ? this.data.curAmount - 10 : 0;
    var num = Math.ceil(am / this.data.curGood.price);
    am = num * this.data.curGood.price;
    this.setData({ curAmount: am, curNum:num});
    this.updateOrderList();
  },
  curAmountEdited: function (event) {
    var am = event.detail.value;
    var num = Math.ceil(am / this.data.curGood.price);
    am = num * this.data.curGood.price;
    this.setData({ curAmount: am, curNum: num });
    this.updateOrderList();
  },
  updateOrderList: function(){
    if(this.data.curGood==null) return;
    if(this.data.curNum==0){  //从已有列表中删除项
      this.removeItemFromSelectedGoods(this.data.curGood.goodsId);
    }else{
      var good = this.getItemFromSelectedGoods(this.data.curGood.goodsId);
      if(good==null){
        good = this.data.curGood;
        this.data.selectedGoods.push(good);
      }
      good.num = this.data.curNum;
      good.money = this.data.curAmount;
      good.isChecked = true;
    }
    this.setData({selectedGoods:this.data.selectedGoods});
  },
  getItemFromSelectedGoods:function(goodsId){
    for(var i=0;i<this.data.selectedGoods.length;i++){
      if(this.data.selectedGoods[i].goodsId == goodsId){
        return this.data.selectedGoods[i];
      }
    }
    return null;
  },
  removeItemFromSelectedGoods: function(goodsId){
    var index=-1;
    for(var i=0;i<this.data.selectedGoods.length;i++){
      if(this.data.selectedGoods[i].goodsId == goodsId){
        index = i;
        break;
      }
    }
    if(index!=-1){
      this.data.selectedGoods.splice(index,1);
    }
  },
  selectedGoodCheckboxChange: function(e){
    var good = this.data.selectedGoods[e.currentTarget.dataset.index];
    //console.log(e);
    //console.log(good);
    if(good==null) return;
    good.isChecked = !good.isChecked;
    this.setData({ selectedGoods: this.data.selectedGoods });
  },

  onSubmit: function(){
    console.log(this.data.selectedGoods)
    app.orderGoods = this.data.selectedGoods;
    app.orderDeliveryFee = this.data.deliveryFee;
    app.orderNeedDelivery = this.data.needDelivery;

    if(this.data.selectedGoods.length==0){
      wx.showToast({
        title: '您尚未选择任何商品',
        icon: 'none'
      })
      return;
    }

    wx.navigateTo({
      url: '/pages/querendingdan/querendingdan',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.searchKeyword == '') {
      this.data.categoryId = app.categoryId
      app.request('/customer/goods/list', 'post', { openId: app.openid, categoryId: this.data.categoryId }, this.loadCategoryList)
    } else {
      app.request('/customer/goods/names', 'post', { openId: app.openid, names: app.searchKeyword }, this.loadSearchResult)
      wx.getStorage({
        key: 'recentSearches',
        success: function (res) {
          var data=[];
          if (res != null && typeof res != "undefined"){
            data = res.data
          }
          var has=false
          for(var i=0;i<data.length;i++){if(data[i].name == app.searchKeyword){has = true; break;}}
          if(has) return;
          data.push({id:null, name:app.searchKeyword})
          if(data.length>10){data.splice(0,1)}
          wx.setStorage({
            key: 'recentSearches',
            data: data,
          })
        },
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.showTabBar({
      
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})