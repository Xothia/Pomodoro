// pages/countdown/countdown.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    min:25,
    sec:0,

    d:[ "20rpx 610rpx 20rpx 20rpx",
        "20rpx 610rpx 20rpx 20rpx",
        "20rpx 610rpx 20rpx 20rpx",
        "20rpx 610rpx 20rpx 20rpx",
        "20rpx 610rpx 20rpx 20rpx",
        "20rpx 610rpx 20rpx 20rpx",
        "20rpx 610rpx 20rpx 20rpx"],

    todolist:'',
  },

  blt: function(e){
    var that=this;
    var td_id = e.currentTarget.dataset.tdid;
    var mid = wx.getStorageSync("my_id");

    wx.request({
      url: 'https://www.r-relight.com/wxapp.pomodoro/delToDo',
      data: {
        id:mid,
        td_id:td_id,
      },

      method: 'GET',
      success: res=>{
        if(res.data.errno!=0){
          console.log('failed to del todo!'+' errmsg:'+res.data.errmsg+' errno:'+res.data.errno);
          return;
        }

        that.getToDo();
      },
      fail:function(){
        console.log('failed to request!');
      }
    });

  },

  tap1: function(){
    wx.navigateTo({
      url: '/pages/submit/submit',
    })
  },

  getToDo: function(){
    var that=this;
    var mid = wx.getStorageSync("my_id");

    wx.request({
      url: 'https://www.r-relight.com/wxapp.pomodoro/getToDo',
      data: {
        id:mid,
      },
      method: 'GET',
      success: res=>{
        if(res.data.errno!=0){
          console.log('failed to add todo!'+' errmsg:'+res.data.errmsg+' errno:'+res.data.errno);
          return;
        }
        var tdl = res.data.data;
        for(var i=0;i<tdl.length;i++){
          if(tdl[i]['b_time']!=0){
            var time = require('../../utils/util.js');
            var realtime = time.formatTimeCN(tdl[i]['b_time']);
            tdl[i]['dt']=realtime;
          }
          else{
            tdl[i]['dt']='无 期';
          }
        }

        that.setData({
          todolist:tdl,
        });
      },
      fail:function(){
        console.log('failed to request!');
      }
    });



  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getToDo();
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
      
    this.getToDo();
    wx.showShareMenu({
      withShareTicket: true,
      menus:['shareAppMessage','shareTimeline']
    });

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
    this.getToDo();

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.vibrateShort();

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})