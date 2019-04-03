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
    curTab: 'doing'   //doing待处理 done已完成 close 关闭  all全部
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  reloadOrders: function(e){
    this.data.orderList = [];
    this.data.pageNum = 1
    this.data.pageSize = 10
    this.data.total = 0
    this.setData({curTab: e.currentTarget.dataset.tab})
    this.loadOrders();  
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
    })
  },

  confirmDone:function(e){
    var that = this
    app.request('/customer/order/confirm','post',{openId:app.openid, orderNo:e.currentTarget.dataset.orderno},function(re){
      if(re.result){
        wx.showToast({
          title: '确认成功',
        })
        that.updateOrderStatusByNo(e.currentTarget.dataset.orderno, '600')
      }
    })
  },

  createAgainOrder(data){

    app.orderGoods = data.list;
    app.orderDeliveryFee = data.deliveryCash;
    app.orderNeedDelivery = data.deliveryCash>0;

    wx.navigateTo({
      url: '/pages/querendingdan/querendingdan',
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
        break;
      }
    }
    this.setData({orderList:this.data.orderList})
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