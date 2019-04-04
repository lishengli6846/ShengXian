//app.js
App({
  baseUrl: 'http://47.74.247.133:8083',
  openid: wx.getStorageSync('openid') || null,
  searchKeyword: '',
  sessionId: null,
  orderGoods:[],
  categoryId:-1,
  defaultAddress: { addressId: -1, name: "", phone: "", address: ""},
  tmp:{},
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    wx.hideTabBar({
    })

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // TODO:暂时缺少登录接口，设置临时openid=1
        // this.openid = 1;
        console.log(res.code);
        try{
          var that = this;
          wx.request({
            url: this.baseUrl + '/customer/user/miniprogram/loginwx?code='+res.code,
            data: {
              code: res.code
            },
            header: {
              contenttype: 'application/json'
            },
            method:'post',
            success: function(re){
              if(re.data.result){
                that.openid = re.data.data.openId;
                that.sessionId = re.data.data.sessionId;
                console.log('openid:'+that.openid);
                wx.setStorage({
                  key: 'openid',
                  data: that.openid,
                })
                that.sendUserPosition();
              }else{
                console.log(re);
                wx.showToast({title:'自动登录失败',icon:'none'});          
              }
            },
            fail: function(re){
              console.log(re);
              wx.showToast({title:'服务器无响应',icon:'none'});
            }
          });
        }catch(error){
        }
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
    //获取默认地址
    var that = this;
    this.request('/customer/address/list', 'post', { pageNum: 1, pageSize: 100, search: { openId: this.openid } }, function (re) {
      console.log(re)
      re.data.list.forEach(v => {
        if (v.status == '10') {
          that.defaultAddress = {
            addressId: v.addressId,
            name: v.consigneeName,
            phone: v.consigneePhone,
            address: v.address
          }
        }
      });
    })

    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })

  },
  sendUserPosition: function(){
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        //console.log(res);
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        that.request('/customer/user/miniprogram/syncAddress','post',{
          openId:that.openid,
          longitude: longitude,
          latitude: latitude
        },function(){})
      }
    })
  },
  globalData: {
    userInfo: null
  },
  request: function (url, method, data, callback, header ='application/json'){
    //application/x-www-form-urlencoded
    wx.request({
      url: this.baseUrl + url,
      data: data,
      method: method,
      header: { "content-type": header, "sessionId":this.sessionId },
      success: function (re) {
        if(re.error){
          wx.showToast({title:'服务器返回错误'})
          console.log('服务器返回错误：'+url)
          console.log(re)
          return;
        }
        if(re.data.result==false){
          wx.showToast({
            title: re.data.message,
            icon: 'none'
          })
          console.log('提交失败:'+url)
          console.log(re)
        }
        callback(re.data);
      },
      fail: function(re){
        wx.showToast({
          title: '服务器无响应',
          icon: 'none'
        })
      }
    })
  }
})