//app.js
App({
  baseUrl: 'http://47.74.247.133:8083',
  openid: wx.getStorageSync('openid') || null,
  orderGoods:[],
  defaultAddress: { addressId: 1, name: "王某某", phone: "188***88888", address: "北京市海淀区西二旗珠江摩尔国际大厦3号楼"},
  tmp:{},
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // TODO:暂时缺少登录接口，设置临时openid=1
        this.openid = 1;
        console.log(res.code);return;
        wx.request({
          url: this.baseUrl + '/customer/user/miniprogram/loginwx',
          data: {
            code: res.code
          },
          success: function(re){
            if(re.result){
              this.openid = re.data;
              wx.setStorage({
                key: 'openid',
                data: this.openid,
              })
              this.sendUserPosition();
            }
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  sendUserPosition: function(){
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        //console.log(res);
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        this.request('/customer/user/miniprogram/syncAddress','post',{
          openId:this.openid,
          longitude: longitude,
          latitude: latitude
        },function(){})
      }
    })
  },
  globalData: {
    userInfo: null
  },
  request: function(url,method,data,callback){
    wx.request({
      url: this.baseUrl + url,
      data: data,
      method: method,
      success: function (re) {
        callback(re.data);
      }
    })
  }
})