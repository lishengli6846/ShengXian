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
    phone: '',
    addressShengShiQu:'',
    isEdit:false,
    addressId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    if(options.edit == 'true'){
      this.setData({
        isEdit: true,
        addressId: app.tmp.address.addressId,
        name: app.tmp.address.consigneeName,
        address: app.tmp.address.address,
        // latitude: app.tmp.address.latitude,  //TODO:服务器返回的地址暂无经纬度
        // longitude: app.tmp.address.longitude,
        phone: app.tmp.address.consigneePhone
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
        var shengshiqu ='';
        if (address.indexOf('省') > 0) shengshiqu = address.substr(0, address.indexOf('省')+1)
        if (address.indexOf('市') > 0) shengshiqu = address.substr(0, address.indexOf('市')+1)
        if (address.indexOf('区') > 0) shengshiqu = address.substr(0, address.indexOf('区')+1)

        _this.setData({
          // name: name,
          address: address+name,
          latitude: latitude,
          longitude: longitude,
          addressShengShiQu: shengshiqu
        })
      }
    })
  },
  modifyAddress: function (event) {
    this.setData({
      address: event.detail.value
    })
  },
  modifyName:function(e){this.setData({name:e.detail.value})},
  modifyPhone: function (e) { this.setData({ phone: e.detail.value }) },

  onSave: function(e){
    var data = {
      address: this.data.address,
      administrativeDivisionId: 1,  //TODO:因服务器未完善，临时设置为1，该字段是省市区ID
      consigneeName: this.data.name,
      consigneePhone: this.data.phone,
      latitude: this.data.latitude + "",
      longitude: this.data.longitude + "",
      openId: app.openid
    };
    if(this.data.isEdit){
      data.addressId = this.data.addressId;
    }
    app.request('/customer/address/edit', 'post',data ,function(re){
      console.log(re)
      if(re.result){
        wx.showToast({title:'保存成功'})
        wx.navigateBack({ delta:1})
      }
    })
  },
  onCancel:function(e){wx.navigateBack({
    delta:1
  })}
})