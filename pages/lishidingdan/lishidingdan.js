// pages/lishidingdan/lishidingdan.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList:[],
    pageNum:0,
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    app.request('/customer/order/list','post',{
      search:{
        openId:app.openid,
        status: this.data.curTab
      }
    },function(re){
      if(re.result){
        that.data.orderList=[];
        re.data.list.forEach(v=>{
          that.data.orderList.push(v)
          that.data.pageNum = re.data.pageNum
          that.data.pageSize = re.data.pageSize
          that.data.total = re.data.total
        })
        that.setData({orderList:that.data.orderList})
      }
    })
  },

  reloadOrders: function(e){
    this.setData({curTab: e.currentTarget.dataset.curTab})
    this.onShow();  //调用onshow重新加载订单
  },

  buyAgain: function(e){
    var orderNo = e.currentTarget.dataset.orderNo
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

  createAgainOrder(data){

    app.orderGoods = data.list;
    app.orderDeliveryFee = data.deliveryCash;
    app.orderNeedDelivery = data.deliveryCash>0;

    wx.navigateTo({
      url: '/pages/querendingdan/querendingdan',
    })

  },

  closeOrder: function(e){
    var orderNo = e.currentTarget.dataset.orderNo
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  onCopy: function(e){
    console.log(e)
    wx.setClipboardData({
      data: e.currentTarget.dataset.orderNo,
    })
  }
})