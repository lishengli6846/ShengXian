// pages/zhuye/zhuye.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:[],
    selectedGoods: [],
    categoryId: 1,
    curGood:null,
    curNum: 0,
    curAmount: 0,
    scrollHeight: (wx.getSystemInfoSync().windowHeight+30)+'rpx',
    needDelivery: true,
    deliveryFee: 0
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideTabBar({
    })

  },

  loadSearchResult: function(re){
    var list=[];
    console.log(re);
    var that = this;
    re.data.forEach(v => {
      app.request('/customer/goods/detail', 'post', { goodsId: v.id }, function (r) {
         list.push(r.data);
         that.setData({ goods: list })
      },'application/x-www-form-urlencoded')
      });
  },

  loadCategoryList: function(re){
    if(re.result){
      //TODO:未引入分页功能，后台暂无分页参数
      var list = [{
        goodsId: 101,
        picUrl: '../../images/j-i10.png',
        name: '现货油桃500g',
        price: '6.99'
      }, {
          goodsId: 101,
          picUrl: '../../images/j-i10.png',
          name: '现货油桃500g',
          price: '6.99'
        }, {
          goodsId: 101,
          picUrl: '../../images/j-i10.png',
          name: '现货油桃500g',
          price: '6.99'
        }, {
          goodsId: 101,
          picUrl: '../../images/j-i10.png',
          name: '现货油桃500g',
          price: '6.99'
        }, {
          goodsId: 101,
          picUrl: '../../images/j-i10.png',
          name: '现货油桃500g',
          price: '6.99'
        }, {
          goodsId: 101,
          picUrl: '../../images/j-i10.png',
          name: '现货油桃500g',
          price: '6.99'
        }, {
          goodsId: 101,
          picUrl: '../../images/j-i10.png',
          name: '现货油桃500g',
          price: '6.99'
        }, {
          goodsId: 101,
          picUrl: '../../images/j-i10.png',
          name: '现货油桃500g',
          price: '6.99'
        }, {
          goodsId: 101,
          picUrl: '../../images/j-i10.png',
          name: '现货油桃500g',
          price: '6.99'
        }, {
          goodsId: 101,
          picUrl: '../../images/j-i10.png',
          name: '现货油桃500g',
          price: '6.99'
        }];
      re.data.list.forEach(v=>{list.push(v)});
      this.setData({goods:list});
    }
  },

  deliveryCheckboxChange: function(e){
    // console.log(e)
    this.setData({ needDelivery: e.detail.value.length > 0})
    
  },

  setSelectedGood: function(data){
    var index = data.currentTarget.dataset.index;
    if(this.data.goods.length > index && index>=0){
      var good = this.getItemFromSelectedGoods(this.data.goods[index].goodsId);
      if(good==null){
        good = this.data.goods[index];
        this.data.curNum=0;
        this.data.curAmount=0;
        good.num=0;
        good.money=0;
      }
      this.setData({curGood: good, scrollHeight:'550rpx'})
    }
  },

  curNumPlus:function(){
    var num = this.data.curNum + 1;
    this.setData({curNum:num,curAmount:this.data.curGood.price*num});
    this.updateOrderList();
  },
  curNumReduce: function () { 
    var num = (this.data.curNum - 1 > 0 ? this.data.curNum - 1 : 0);
    this.setData({ curNum: num, curAmount: this.data.curGood.price * num});
    this.updateOrderList();
  },
  curNumEdited: function (event) { 
    var num = event.detail.value;
    this.setData({ curNum: num, curAmount: this.data.curGood.price * num });
    this.updateOrderList();
  },
  curAmountPlus: function () { 
    var am = this.data.curAmount + 10;
    var num = Math.ceil(am/this.data.curGood.price);
    am = num*this.data.curGood.price;
    this.setData({ curAmount: am,curNum:num});
    this.updateOrderList();
  },
  curAmountReduce: function () {
    var am = this.data.curAmount - 10 > 0 ? this.data.curAmount - 10 : 0;
    var num = Math.ceil(am / this.data.curGood.price);
    am = num * this.data.curGood.price;
    this.setData({ curAmount: am, curNum:num});
    this.updateOrderList();
  },
  curAmountEdited: function (event) {
    var am = event.detail.value;
    var num = Math.ceil(am / this.data.curGood.price);
    am = num * this.data.curGood.price;
    this.setData({ curAmount: am, curNum: num });
    this.updateOrderList();
  },
  updateOrderList: function(){
    if(this.data.curGood==null) return;
    if(this.data.curNum==0){  //从已有列表中删除项
      this.removeItemFromSelectedGoods(this.data.curGood.goodsId);
    }else{
      var good = this.getItemFromSelectedGoods(this.data.curGood.goodsId);
      if(good==null){
        good = this.data.curGood;
        this.data.selectedGoods.push(good);
      }
      good.num = this.data.curNum;
      good.money = this.data.curAmount;
      good.isChecked = true;
    }
    this.setData({selectedGoods:this.data.selectedGoods});
  },
  getItemFromSelectedGoods:function(goodsId){
    for(var i=0;i<this.data.selectedGoods.length;i++){
      if(this.data.selectedGoods[i].goodsId == goodsId){
        return this.data.selectedGoods[i];
      }
    }
    return null;
  },
  removeItemFromSelectedGoods: function(goodsId){
    var index=-1;
    for(var i=0;i<this.data.selectedGoods.length;i++){
      if(this.data.selectedGoods[i].goodsId == goodsId){
        index = i;
        break;
      }
    }
    if(index!=-1){
      this.data.selectedGoods.splice(index,1);
    }
  },
  selectedGoodCheckboxChange: function(e){
    var good = this.data.selectedGoods[e.currentTarget.dataset.index];
    //console.log(e);
    //console.log(good);
    if(good==null) return;
    good.isChecked = !good.isChecked;
    this.setData({ selectedGoods: this.data.selectedGoods });
  },

  onSubmit: function(){
    app.orderGoods = this.data.selectedGoods;


    wx.navigateTo({
      url: '/pages/querendingdan/querendingdan',
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
    if (app.searchKeyword == '') {
      app.request('/customer/goods/list', 'post', { openId: app.openid, categoryId: this.data.categoryId }, this.loadCategoryList)
    } else {
      app.request('/customer/goods/names', 'post', { openId: app.openid, names: app.searchKeyword }, this.loadSearchResult)
    }
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