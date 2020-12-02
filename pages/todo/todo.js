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

    todolist:[{ 'id'	:	2,
    'td_id'	:	8  ,
    'b_time'	:	0   ,
    'content'	:	'dgshr-0hssf',
    },
    {'id'	:	2,
      'td_id':	12,
      'b_time'	:	0,
      'content'	:	'水水水水水水水水',
      },
    {'id'	:	2,
      'td_id'	:	13   ,
      'b_time'	:	0    ,
      'content'	:	'！点的啥',
      },
    {'id'	:	2,
      'td_id'	:	4,
      'b_time'	:	3 ,
      'content'	:	'dasf',
      }],
  },
  tap: function(){
    this.getToDo();
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
            var realtime = new Date(tdl[i]['b_time']).toLocaleString().replace(/:\d{1,2}$/,' ');
            tdl[i]['dt']=realtime.slice(5,);
          }
          else{
            tdl[i]['dt']='无日期';
          }

          //console.log(realtime.slice(5,))
        }

        /*
        for(let i in tdl){
          console.log(i['b_time']);
          var realtime = new Date(timestamp).toLocaleString().replace(/:\d{1,2}$/,' ');
          console.log(realtime.slice(5,))
        }
*/

        //console.log(that.data.todolist[0]['content']);
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