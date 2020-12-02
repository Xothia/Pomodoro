// pages/submit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date:'选择年月日',
    time:'选择时分',
    picktime:true,
    height:'0rpx'
  },

  swichchange:function(e){
    wx.vibrateShort();
    this.setData({
      date:'选择年月日',
      time:'选择时分',
      picktime:e.detail.value,
    });
  },

  bddatec: function(e){
    console.log( e.detail.value);
    this.setData({
      date:e.detail.value,
    });
  },

  bdtimec: function(e){
    console.log( e.detail.value);
    this.setData({
      time:e.detail.value,
    });
  },

  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var date = this.data.date;
    var time = this.data.time;
    var input = e.detail.value['input'];


    if(input==""){
      wx.showToast({
        title: '请填写事件',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    if((date=='选择年月日'||time=='选择时分')&&this.data.picktime){
      wx.showToast({
        title: '请选择日期和时间',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    //将日期转换为时间戳 然后携带id timestamp content发起请求



    this.setData({
      date:'选择年月日',
      time:'选择时分',
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  }
})