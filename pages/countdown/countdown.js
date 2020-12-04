// pages/countdown/countdown.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dat:['12/24','12/24','12/24','12/24','12/24','12/24','12/24'],
    time1:[[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99],
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59]],

    min:25,
    sec:0,
    sum_time:0,
    interval:'',
    d:[ "20rpx 500rpx 20rpx 130rpx",
        "20rpx 500rpx 20rpx 130rpx",
        "20rpx 500rpx 20rpx 130rpx",
        "20rpx 500rpx 20rpx 130rpx",
        "20rpx 500rpx 20rpx 130rpx",
        "20rpx 500rpx 20rpx 130rpx",
        "20rpx 500rpx 20rpx 130rpx"],

    time:[ 0, 0, 0, 0, 0, 0, 0],
    timese:[0, 0],
    settime:false,
  },

  longpress:function(e){
    clearInterval(this.data.interval);

    this.setData({
      min:25,
      sec:0,
      interval:'',
    });
  },
  tapstart: function(e){
    console.log(e.timeStamp);
    this.data.timese[0] = e.timeStamp;
    if(this.data.timese[0]-this.data.timese[1]<150){
      clearInterval(this.data.interval);
      this.setData({
        settime:true,
      });
    }
  },
  tapend: function(e){
    console.log(e.timeStamp);

    this.data.timese[1] = e.timeStamp;
  },

  bdcancel:function(){
    this.setData({
      settime:false,
    });
  },

  startcd: function(){
    //wx.vibrateShort();

    if(this.data.timese[1]-this.data.timese[0] > 300||this.data.settime){ 
      if(this.data.interval!=''){ //存在定时器则将其清空
        clearInterval(this.data.interval);
        this.setData({
          interval:'',
        });
      }
      return;
    }
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
          this.getUseTime();  //渲染使用时长
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
    
            if(minn==0&&secc==0){
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
              ['d['+i+']']: '20rpx '+(20+480*(1-ritio))+'rpx 20rpx 130rpx',
              ['time['+i+']']: (time/60).toFixed(1),
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

  getdate: function(){
    var time = require('../../utils/util.js');
    for(var i=0;i<7;i++){
     var str = time.getDay(i);
      console.log(str);
      this.setData({
        ['dat['+i+']']:str,
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUseTime();
    this.getdate();
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
    this.getUseTime();  //渲染使用时长
    this.getdate();
    wx.showShareMenu({
      withShareTicket: true,
      menus:['shareAppMessage','shareTimeline']
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.interval);

    this.setData({
      interval:'',
    });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

    clearInterval(that.data.interval);
    var st = that.data.sum_time;
    var mid = wx.getStorageSync("my_id");

    that.setData({
      min:25,
      sec:0,
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
        this.getUseTime();  //渲染使用时长
      },
      fail:function(){
        console.log('failed to request!');
      }
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getdate();
    this.getUseTime();  //渲染使用时长

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