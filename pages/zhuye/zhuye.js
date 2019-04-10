// pages/zhuye/zhuye.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:[],
    selectedGoods: [],
    categorys: [{ className: 'color1', text: '全部', id: -1 }],
    categoryIndex:0,
    categoryId: -1,
    curGood:null,
    curNum: 0,
    curAmount: 0,
    scrollHeight: '600rpx',//(wx.getSystemInfoSync().windowHeight+30)+
    needDelivery: false,
    deliveryFee: 0,
    allowDelivery: false,
    showModal: false,
    modelInput:'',
    pageNum:1,
    pageSize:10,
    total:0
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log('scrollHeight:'+this.data.scrollHeight)
    app.request('/customer/goods/category/list', 'post', {}, this.loadCategory)
    //console.log(app.defaultAddress)

  },

  loadSearchResult: function(re){
    var list=[];
    console.log(re);
    this.setData({pageNum:1,pageSize:re.data.length,total:re.data.length})
    var that = this;
    re.data.forEach(v => {
      app.request('/customer/goods/detail', 'post', { goodsId: v.id }, function (r) {
         list.push(r.data);
         that.setData({ goods: list })
      },'application/x-www-form-urlencoded')
      });
  },

  loadCategory: function (re) {
    var mesbtn = this.data.categorys;
    for (var i = 0; i < re.data.length; i++) {
      mesbtn.push({ className: 'color' + (i + 2), text: re.data[i].categoryName, id: re.data[i].id });
      if(re.data[i].id == app.categoryId){
        this.data.categoryIndex = i;
      }
    }
    this.setData({ categorys: mesbtn });
  },

  loadCategoryList: function(re){
    if(re.result){
      console.log('run into loadCategoryList and returned ok')
      //TODO:未引入分页功能，后台暂无分页参数
      var list = this.data.goods
      re.data.list.forEach(v=>{list.push(v)});
      this.setData({goods:list, pageNum:re.data.pageNum, pageSize:re.data.pageSize, total:re.data.total});
    }
  },

  /**
   * 如果是再次购买（全局变量含有订单数据），设置购买信息
   */
  setOrderInfoIfBuyAgain: function(){
    console.log('run into setOrderInfoIfBuyAgain')
    if(app.orderGoods.length==0){return;}
    app.orderGoods.forEach(v=>{
      v.money = v.price*v.num
      v.isChecked = true
    })
    this.setData({selectedGoods:app.orderGoods})
  },

  bindCategoryChange:function(e){
    app.categoryId = this.data.categorys[e.detail.value].id
    app.searchKeyword=''
    this.setData({categoryIndex:e.detail.value})
    this.onShow();
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
      }else{
        this.data.curNum = good.num
        this.data.curAmount = good.money
      }
      this.setData({curGood: good, curNum:this.data.curNum, curAmount:this.data.curAmount, scrollHeight:'480rpx'})
    }

    //计算运费(目前只适配是否启用配送功能)
    var detail = [];
    var that = this;
    this.data.selectedGoods.forEach(v => {
      detail.push({ cash: v.price * v.num, goodsId: v.goodsId + '', num: v.num })
    })
    app.request('/customer/order/delivery/cash', 'post', {
      addressId: 1,
      detail: detail,
      openId: app.openid
    }, function (e) {
      console.log(e);
      if (e.result) {
        that.setData({ allowDelivery: e.data.allow, deliveryFee: e.data.deliveryCash })
      }
    })
  },

  showpro:function(data){
    var id = data.currentTarget.dataset.id;
    if (id) {
      var good = this.getItemFromSelectedGoods(id);
      console.log(good)
      if (good == null) {
        good = this.data.goods[index];
        this.data.curNum = 0;
        this.data.curAmount = 0;
        good.num = 0;
        good.money = 0;
      } else {
        this.data.curNum = good.num
        this.data.curAmount = good.money
      }
      this.setData({ curGood: good, curNum: this.data.curNum, curAmount: this.data.curAmount, scrollHeight: '480rpx' })
    }
  },

  curNumPlus:function(){
    if(this.data.curGood.stock<=0) return;
    var num = this.data.curNum + 1;
    this.setData({curNum:num,curAmount:this.data.curGood.price*num});
    this.updateOrderList();
  },
  curNumReduce: function () { 
    if (this.data.curGood.stock <= 0) return;
    var num = (this.data.curNum - 1 > 0 ? this.data.curNum - 1 : 0);
    this.setData({ curNum: num, curAmount: this.data.curGood.price * num});
    this.updateOrderList();
  },
  curNumEdited: function (event) { 
    if (this.data.curGood.stock <= 0) return;
    var num = event.detail.value;
    this.setData({ curNum: num, curAmount: this.data.curGood.price * num });
    this.updateOrderList();
  },
  curAmountPlus: function () { 
    if (this.data.curGood.stock <= 0) return;
    var am = this.data.curAmount + 10;
    var num = Math.ceil(am/this.data.curGood.price);
    am = num*this.data.curGood.price;
    this.setData({ curAmount: am,curNum:num});
    this.updateOrderList();
  },
  curAmountReduce: function () {
    if (this.data.curGood.stock <= 0) return;
    var am = this.data.curAmount - 10 > 0 ? this.data.curAmount - 10 : 0;
    var num = Math.ceil(am / this.data.curGood.price);
    am = num * this.data.curGood.price;
    this.setData({ curAmount: am, curNum:num});
    this.updateOrderList();
  },
  curAmountEdited: function (event) {
    if (this.data.curGood.stock <= 0) return;
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
    console.log(this.data.selectedGoods)
    app.orderGoods = this.data.selectedGoods;
    app.orderDeliveryFee = this.data.deliveryFee;
    app.orderNeedDelivery = this.data.needDelivery;

    if(this.data.selectedGoods.length==0){
      wx.showToast({
        title: '您尚未选择任何商品',
        icon: 'none'
      })
      return;
    }

    // 手机号提示


    if (!app.userInfo.phone) {
      wx.showToast({
        title: '请先绑定手机号！',
        icon: 'none'
      })
      this.showDialogBtn()
      return;
    }



    wx.navigateTo({
      url: '/pages/querendingdan/querendingdan',
    })
  },
  godd:function(){
    wx.switchTab({
      url: '/pages/lishidingdan/lishidingdan',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  loadNextPage: function(){
    this.data.pageNum++;
    app.request('/customer/goods/list', 'post', {
      openId: app.openid, categoryId: this.data.categoryId != -1 ? this.data.categoryId : null, pageNum: this.data.pageNum,
      pageSize: this.data.pageSize
    }, this.loadCategoryList)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideTabBar({
    })
    if (app.searchKeyword == '') {
      this.setOrderInfoIfBuyAgain();
      //判断分类无变化且已有数据，不再重复加载
      if(this.data.categoryId == app.categoryId && this.data.goods.length>0){return;}
      this.data.categoryId = app.categoryId
      this.data.goods=[]  //clear goods data
      app.request('/customer/goods/list', 'post', {
        openId: app.openid, categoryId: this.data.categoryId != -1 ? this.data.categoryId : null, pageNum: this.data.pageNum,
        pageSize: this.data.pageSize }, this.loadCategoryList)
    }else {
      app.request('/customer/goods/names', 'post', { openId: app.openid, names: app.searchKeyword }, this.loadSearchResult)
      wx.getStorage({
        key: 'recentSearches',
        success: function (res) {
          var data=[];
          if (res != null && typeof res != "undefined"){
            data = res.data
          }
          var has=false
          for(var i=0;i<data.length;i++){if(data[i].name == app.searchKeyword){has = true; break;}}
          if(has) return;
          data.push({id:null, name:app.searchKeyword})
          if(data.length>10){data.splice(0,1)}
          wx.setStorage({
            key: 'recentSearches',
            data: data,
          })
        },
      })
    }
  },
  //获取手机号 后下单
  getPhoneNumber(e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    this.onSubmit();
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // wx.showTabBar({
      
    // })
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
     * 弹窗
     */
  showDialogBtn: function () {

    this.setData({
      showModal: true
    })
  },
  /**
   * 弹窗输入事件
   */
  modelInputChange:function(e){
    this.data.modelInput = e.detail.value;
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    //提交手机号
    app.userInfo.phone = this.data.modelInput
    app.sendUserPosition()
    wx.showToast({
      title: '提交成功',
      icon: 'success',
      duration: 2000
    })
    this.hideModal();
  }
})