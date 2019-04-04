// pages/fenleiye/fenleiye.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    mesbtn:[
      {className: 'color1',text:'全部',id:-1}
      ],
        words:"海鲜大体上指海水中的鱼、虾、蟹、贝、海藻这些，而水产是大的行业名词，包括养殖、捕捞、加工、饲料、兽药这几个行业，涉及海、淡水               两大水体环境。海鲜大体上指海水中的鱼、虾、蟹、贝、海藻这些，而水产是大的行业名词，包括养殖、捕捞、加工、饲料、兽药这几个行业，              涉及海、淡水两大水体环境。海鲜大体上指海水中的鱼、虾、蟹、贝、海藻这些，而水产是大的行业名词，包括养殖、捕捞、加工、饲料、兽                药 这几个行业，涉及海、淡水两大水体环境。海鲜大体上指海水中的鱼、虾、蟹、贝、海藻这些，而水产是大的行业名词，包括养殖、捕捞、               加工、饲料、兽药这几个行业，涉及海、淡水两大水体环境。海鲜大体上指海水中的鱼、虾、蟹、贝、海藻这些，而水产是大的行业名词，包                括 养殖、捕捞、",
         share: '分享'
         
      },

  loadCategory: function (re) {
    var mesbtn=this.data.mesbtn;
    for (var i = 0; i < re.data.length; i++) {
      mesbtn.push({ className: 'color' + (i + 2), text: re.data[i].categoryName ,id:re.data[i].id});
    }
    this.setData({mesbtn:mesbtn});
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.redirectTo({
      // url: '/pages/zhuye/zhuye',
      // url: '/pages/nav/nav',
      // url: '/pages/dizhiliebiao/dizhiliebiao'
      // url: '/pages/xinzengdizhi/xinzengdizhi'
      // url: '/pages/sousuo/sousuo'
    // })
    // wx.switchTab({
      // url: '/pages/zhuye/zhuye',
      // url: '/pages/lishidingdan/lishidingdan',
    // })
    app.request('/customer/goods/category/list', 'post', {}, this.loadCategory)
  },


  showCategory: function(data){
    console.log(data.currentTarget.dataset.index);
    app.categoryId = this.data.mesbtn[data.currentTarget.dataset.index].id
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
    wx.hideTabBar({
    })

  },

  getUserInfo: function (e) {
    console.log(e.detail.userInfo)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})