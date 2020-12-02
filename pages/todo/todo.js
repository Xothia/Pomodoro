// pages/countdown/countdown.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time1:[[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99],
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59]],

    min:25,
    sec:0,
    sum_time:0,
    interval:'',
    d:[ "20rpx 610rpx 20rpx 20rpx",
        "20rpx 610rpx 20rpx 20rpx",
        "20rpx 610rpx 20rpx 20rpx",
        "20rpx 610rpx 20rpx 20rpx",
        "20rpx 610rpx 20rpx 20rpx",
        "20rpx 610rpx 20rpx 20rpx",
        "20rpx 610rpx 20rpx 20rpx"],

    time:[ 0, 0, 0, 0, 0, 0, 0],
    timese:[0, 0],
    settime:false,
  },

  longpress:function(e){
    this.setData({
      min:25,
      sec:0
    });
  },
  tapstart: function(e){
    this.data.timese[0] = e.timeStamp;
    console.log(e.timeStamp);
    if(this.data.timese[0]-this.data.timese[1]<150){
      this.setData({
        settime:true,
      });
    }
  },
  tapend: function(e){
    this.data.timese[1] = e.timeStamp;
    console.log(e.timeStamp);
  },

  startcd: function(){
    if(this.data.timese[1]-this.data.timese[0] > 350){
      return;
    }
    this.getUseTime();  //渲染使用时长

    console.log('tap');
    wx.vibrateShort();
    var that=this;

    if(that.data.interval!=''){ //存在定时器则将其清空并将sumtime加到数据库并置0
      clearInterval(that.data.interval);
      var st = that.data.sum_time;
      var mid = wx.getStorageSync("my_id");

      that.setData({
        interval:'',
        sum_time:0,
      });

      wx.request({
        url: 'https://www.r-relight.com/wxapp.pomodoro/addUseTime',
        data: {
          id:mid,
          ad_time:st,
        },
        method: 'GET',
        success: res=>{
          if(res.data.errno!=0){
            console.log('failed to add time!'+' errmsg:'+res.data.errmsg+' errno:'+res.data.errno);
          }
        },
        fail:function(){
          console.log('failed to request!');
        }
      });

    }
    else{ //不存在定时器 则创建定时器
      that.setData({
        interval:setInterval(
          function(){
            var secc = that.data.sec;
            var minn = that.data.min;
            var stime = that.data.sum_time;
    
            if(minn==0){
              for(var i=0;i<3;i++){
                wx.vibrateLong({});
              }

              clearInterval(that.data.interval);
              that.setData({
                sec:0,
                min:25,
                interval:'',
                sum_time:0,
              });
              var mid = wx.getStorageSync("my_id");
    
              wx.request({
                url: 'https://www.r-relight.com/wxapp.pomodoro/addUseTime',
                data: {
                  id:mid,
                  ad_time:stime+1,
                },
                method: 'GET',
                success: res=>{
                  if(res.data.errno!=0){
                    console.log('failed to add time!'+' errmsg:'+res.data.errmsg+' errno:'+res.data.errno);
                  }
                },
                fail:function(){
                  console.log('failed to request!');
                }
              });
    
              return;
            }
            if(secc == 0){
              
              that.setData({
                sec:59,
                min:minn-1,
                sum_time:stime+1,
              })
            }
            else{
              that.setData({
                sec:secc-1,
                sum_time:stime+1,
              })
            }
          }
          ,1000
        ),
      });
    }

  },

  getUseTime: function(){
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
          var max = 0;
          for(var i=0;i<6;i++){
            if(max<days['day'+i]){
              max = days['day'+i];
            }
          }
          if(max == 0){
            return;
          }

          for(var i=0;i<6;i++){ //修改样式
            var time = days['day'+i];
            if(time==0){
              continue;
            }
            var ritio = time/max;
            that.setData({
              ['d['+i+']']: '20rpx '+(20+590*(1-ritio))+'rpx 20rpx 20rpx',
              ['time['+i+']']: time,
            });
          }

        }
      },
      fail:function(){
        console.log('failed to request!');
      }
    });
  },

  bindchange: function(e){
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      min:e.detail.value[0],
      sec:e.detail.value[1],
      settime:false,
    });

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUseTime();
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