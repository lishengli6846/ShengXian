// pages/sousuo/sousuo.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotSearches: [
      // { key: '香精' },
      // { key: '新鲜冷冻虾' },
      // { key: '野生鲜活大海螺' },
      // { key: '海南贵妃' },
      // { key: '中华红脐橙子' },
      // { key: '百香果' },
      // { key: '洗衣液' },
      ],
    recentSearches: [
      // { key: '海参' },
      // { key: '新鲜冷冻虾' },
      // { key: '野生鲜活大海螺' },
      // { key: '海南贵妃' },
      // { key: '中华红脐橙子' },
      // { key: '百香果' },
      // { key: '洗衣液' },
      ],
    keyword: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.request('/customer/goods/hot/seach','post',{openId: app.openid},function(re){
      if(re.result){
        that.setData({hotSearches:re.data})
      }
    })
  },

  bindKeyInput(e) {
    this.setData({
      keyword: e.detail.value
    })
  },

  onSearchTapped: function(e){
    app.searchKeyword = this.data.keyword;
    console.log(app.searchKeyword)
    wx.switchTab({
      url: '/pages/zhuye/zhuye',
    })
  },

  onTagTapped: function(e){
    app.searchKeyword = e.currentTarget.dataset.key
    console.log(app.searchKeyword)
    wx.switchTab({
      url: '/pages/zhuye/zhuye',
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
    var that = this
    wx.getStorage({
      key: 'recentSearches',
      success: function(res) {
        if (res == null || typeof res == "undefined") return;
        that.setData({recentSearches:res.data})
      },
    })
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

  }
})