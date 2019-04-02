// pages/dizhiliebiao/dizhiliebiao.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
  activeIndex: 0,
  position:[
    // { addressId: 1, consigneeName: "王某某", consigneePhone:"188***88888",address:"北京市海淀区西二旗珠江摩尔国际大厦3号楼" ,checked:'false'},
    // { addressId: 2, consigneeName: "王某某", consigneePhone: "188***88888", address: "北京市海淀区西二旗珠江摩尔国际大厦3号楼2", checked: 'false' },
    // { addressId: 3, consigneeName: "王某某", consigneePhone: "188***88888", address: "北京市海淀区西二旗珠江摩尔国际大厦3号楼3", checked: 'false' },
    // { addressId: 4, consigneeName: "王某某", consigneePhone: "188***88888", address: "北京市海淀区西二旗珠江摩尔国际大厦3号楼4", checked: 'false' }
    ]
  },

  onLoad: function(e){
    
  },
  onShow: function(e){
    var that = this;
    app.request('/customer/address/list', 'post', { pageNum: 1, search: { openId: app.openid } }, function (re) {
      console.log(re)
      var total = re.data.total;
      var pageNum = re.data.pageNum;
      var defaultIndex =0;
      that.data.position = [];
      re.data.list.forEach(v => { 
        that.data.position.push(v)
        if(v.status=='10'){that.setData({activeIndex:defaultIndex})} 
        defaultIndex++;
        });
      that.setData({ position: that.data.position })
    })
  },

  radioChange:function(e) {
    var index = e.currentTarget.id;
    this.setData({
      activeIndex: index
    })
    app.request('/customer/address/default', 'post', { openId: app.openid, addressId: this.data.position[index].addressId }, function (re) { })
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
    app.request('/customer/address/delete', 'post', { openId: app.openid, addressId: addressId }, function () { })
  },

  editAddress: function(e){
    var index = e.currentTarget.id;
    app.tmp.address = this.data.position[index];
    console.log(this.data.position[index])
    wx.navigateTo({
      url: '../xinzengdizhi/xinzengdizhi?edit=true',
    })
  }
})