//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    total_time: 0,
  },

  gettotaltime: function(){
    var that=this;
    var mid = wx.getStorageSync("my_id");
    wx.request({
      url: 'https://www.r-relight.com/wxapp.pomodoro/getUseTime',
      data: {
        id:mid,
      },
      method: 'GET',
      success: res=>{
        if(res.data.errno!=0){
          console.log('failed to get time!'+' errmsg:'+res.data.errmsg+' errno:'+res.data.errno);
        }
        else{
          var days = res.data.data[0];
          var tt = days['total_time']
          that.setData({
            total_time: (tt/60).toFixed(1),
          });
        }
      },
      fail:function(){
        console.log('failed to request!');
      }
    });
  
  },

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../help/help'
    })
  },
  bt1: function(){
   wx.vibrateLong({});
   wx.navigateTo({
    url: '../help/help'
  })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    this.gettotaltime();
  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  onShow: function(){
    this.gettotaltime();
  }
})
