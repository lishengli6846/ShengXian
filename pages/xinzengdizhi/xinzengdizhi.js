// pages/xinzengdizhi/xinzengdizhi.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    phone: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    if(options.edit == 'true'){
      this.setData({
        name: app.tmp.address.name,
        address: app.tmp.address.address,
        latitude: app.tmp.address.latitude,
        longitude: app.tmp.address.longitude,
        phone: app.tmp.address.phone
      })
    }
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

  /**
   * 选取当前位置
   */
  getLocation: function () {
    var _this = this;

    wx.chooseLocation({
      success: function (res) {
        var name = res.name
        var address = res.address
        var latitude = res.latitude
        var longitude = res.longitude
        _this.setData({
          // name: name,
          address: address,
          latitude: latitude,
          longitude: longitude
        })
      }
    })
  },
  modifyAddress: function (event) {
    this.setData({
      address: event.detail.value
    })
  }

})