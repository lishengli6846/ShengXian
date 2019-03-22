// pages/dizhiliebiao/dizhiliebiao.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
  activeIndex: 0,
  position:[
    { addressId: 1, name: "王某某", phone:"188***88888",address:"北京市海淀区西二旗珠江摩尔国际大厦3号楼" ,checked:'false'},
    { addressId: 2, name: "王某某", phone: "188***88888", address: "北京市海淀区西二旗珠江摩尔国际大厦3号楼2", checked: 'false' },
    { addressId: 3, name: "王某某", phone: "188***88888", address: "北京市海淀区西二旗珠江摩尔国际大厦3号楼3", checked: 'false' },
    { addressId: 4, name: "王某某", phone: "188***88888", address: "北京市海淀区西二旗珠江摩尔国际大厦3号楼4", checked: 'false' }
    ]
  },
  radioChange:function(e) {
    var index = e.currentTarget.id;
    this.setData({
      activeIndex: index
    })
    app.request('/customer/address/default','post',{openId:app.openid,addressId:this.data.position[index].addressId})
  },

  deleteAddress: function(e){
    var addressId = e.currentTarget.id;
    for(var i=0;i<this.data.position.length;i++){
      if(this.data.position[i].addressId == addressId){
        this.data.position.splice(i,1);
        break;
      }
    }
    this.setData({position:this.data.position, activeIndex:-1})
    app.request('/customer/address/delete','post',{openId:app.openid,addressId:addressId},function(){})
  },

  editAddress: function(e){
    var index = e.currentTarget.id;
    app.tmp.address = this.data.position[index];
    wx.navigateTo({
      url: '../xinzengdizhi/xinzengdizhi?edit=true',
    })
  }
})