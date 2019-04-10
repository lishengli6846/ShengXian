// pages/lishidingdan/lishidingdan.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList:[],
    pageNum:1,
    pageSize:10,
    total:0,
    integral:0,
    curTab: 'doing'   //doing待处理 done已完成 close 关闭  all全部
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadOrders();
    this.setData({ heights: app.globalData.CustomBar, StatusBar: app.globalData.StatusBar })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  openOrder: function(e){
    wx.navigateTo({
      url: '/pages/querendingdan/querendingdan?orderno='+e.currentTarget.dataset.orderno,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.loadOrders();
    this.setData({ integral:app.userInfo.integral})
  },

  loadOrders: function(){
    var that = this
    app.request('/customer/order/list', 'post', {
      pageNum:this.data.pageNum,
      pageSize: this.data.pageSize,
      search: {
        openId: app.openid,
        status: this.data.curTab
      }
    }, function (re) {
      if (re.result) {
        re.data.list.forEach(v => {
          that.data.orderList.push(v)
          // that.data.pageNum = re.data.pageNum
          that.data.pageSize = re.data.pageSize
          that.data.total = re.data.total
        })
        that.setData({ orderList: that.data.orderList })
      }
    })
  },
  /**
   * 更新订单信息
   */
  updateOrder: function (orderNo) {
    var that = this
    app.request('/customer/order/list', 'post', {
      search: {
        openId: app.openid,
        orderNo: orderNo
      }
    }, function (re) {
      console.log(re)
      if (re.result) {
        re.data.list.forEach(v => {
          that.updateOrderByNo(v)
        })
      }
    })
  },

  reloadOrders: function(e){
    this.data.orderList = [];
    this.data.pageNum = 1
    this.data.pageSize = 10
    this.data.total = 0
    this.setData({curTab: e.currentTarget.dataset.tab})
    this.loadOrders();  
  },

  switchDelivery: function(e){
    var orderNo = e.currentTarget.dataset.orderno
    var that = this
    app.request('/customer/order/delivery/confirm','post',{
      openId: app.openid,
      orderNo: orderNo,
      deliveryStatus: '200'
    },function(re){
      if(re.result){
        wx.showToast({
          title: '已转为配送',
        })
        that.updateOrder(orderNo)
      }
    })
  },

  switchSelfFetch: function(e){
    var orderNo = e.currentTarget.dataset.orderno
    var that = this
    app.request('/customer/order/delivery/confirm', 'post', {
      openId: app.openid,
      orderNo: orderNo,
      deliveryStatus: '100'
    }, function (re) {
      if (re.result) {
        wx.showToast({
          title: '已转为自提',
        })
        that.updateOrder(orderNo)
      }
    })
  },

  buyAgain: function(e){
    var orderNo = e.currentTarget.dataset.orderno
    var that = this
    
    app.request('/customer/order/show','post',{
      openId:app.openid,
      orderNo:orderNo
    },function(re){
      if(re.result){
        that.createAgainOrder(re.data)
      }else{
        wx.showToast({
          title: '获取订单信息失败',
          icon: 'none'
        })
      }
      },'application/x-www-form-urlencoded')
  },

  confirmDone:function(e){
    var that = this
    app.request('/customer/order/confirm','post',{openId:app.openid, orderNo:e.currentTarget.dataset.orderno},function(re){
      if(re.result){
        wx.showToast({
          title: '确认成功',
        })
        that.updateOrderStatusByNo(e.currentTarget.dataset.orderno, '700')
        
      }
    })
  },

  createAgainOrder(data){
    data.details.forEach(v => { v.isChecked = true})
    app.orderGoods = data.details;
    app.orderDeliveryFee = data.deliveryCash;
    app.orderNeedDelivery = data.deliveryCash>0;

    wx.switchTab({
      url: '/pages/zhuye/zhuye',
    })

  },

  closeOrder: function(e){
    var orderNo = e.currentTarget.dataset.orderno
    console.log(e)
    var that = this
    app.request('/customer/order/cancel','post',{
      openId: app.openid,
      orderNo: orderNo
    },function(re){
      if(re.result){
        wx.showToast({
          title: '订单已关闭',
        })
        that.updateOrderStatusByNo(orderNo, '700')
      }else{
        wx.showToast({
          title: re.message,
          icon: 'none'
        })
      }
    })
  },

  updateOrderStatusByNo: function(orderNo,status){
    for(var i=0;i<this.data.orderList.length;i++){
      if(this.data.orderList[i].orderNo == orderNo){
        this.data.orderList[i].orderStatus = status;
        if(status=='700'){
          this.data.orderList.splice(i,1);
        }
        break;
      }
    }
    this.setData({orderList:this.data.orderList})
  },

  updateOrderByNo: function (newOrderData) {
    for (var i = 0; i < this.data.orderList.length; i++) {
      if (this.data.orderList[i].orderNo == newOrderData.orderNo) {
        this.data.orderList[i] = newOrderData;
        break;
      }
    }
    this.setData({ orderList: this.data.orderList })
  },
  
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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
    if(this.data.pageNum * this.data.pageSize < this.data.total){
      this.data.pageNum++;
      this.loadOrders();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  onCopy: function(e){
    console.log(e)
    wx.setClipboardData({
      data: e.currentTarget.dataset.orderno,
    })
  }
})