//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);

    // 登录
    wx.login({
      timeout:1000,
      success: res => {
        if(res.code){
          wx.request({
            url: 'https://www.r-relight.com/wxapp.token/c2s',
            data: {
              code:res.code
            },
            method: 'GET',
            success: res=>{
              if(res.data.errno==0){
                wx.setStorageSync("my_id",res.data.id);
                console.log(res.data.id);
              }
              else{
                console.log('failed!'+' id:'+res.data.id+' errmsg:'+res.data.errmsg+' errno:'+res.data.errno+' openid:'+res.data.openid+' session_key:'+res.data.session_key+' unionid:'+res.data.unionid);
              }
            },
            fail:function(){
              console.log('failed to request!');
            }
          })
        }
        else{
          console.log('登陆失败'+res.errMsg);
        }
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    });
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    });

  },
  globalData: {
    userInfo: null
  }
})