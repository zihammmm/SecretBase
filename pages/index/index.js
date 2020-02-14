//index.js
//获取应用实例
const app = getApp()

const db = wx.cloud.database();
const usersCollection = db.collection('users');

Page({
  data: {
    isSignUp: null,
    loadComplete: false,
    windowHeight: 0,
    windowWidth: 0
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  about: function() {
    wx.navigateTo({
      url: '../about/about'
    })
  },

  jumpToMain: function() {
    wx.redirectTo({
      url: '../main/main'
    });
  },

  signUp: function() {
    //生成邀请码
    wx.redirectTo({
      url: '../signup/signup',
    })
  },

  jumpToSend: function(){
    wx.navigateTo({
      url: '../sendTickets/sendTickets'
    })
  },

  login: function() {
    if (this.data.isSignUp) {
      this.jumpToMain();
    } else {
      let that = this;
      wx.showModal({
        title: '还未绑定',
        content: '邀请另一半加入吧！',
        success(res) {
          if (res.confirm) {
            that.signUp()
          }
        }
      })
    }

  },

  send: function(){
    if (this.data.isSignUp) {
      this.jumpToSend();
    } else {
      let that = this;
      wx.showModal({
        title: '还未绑定',
        content: '邀请另一半加入吧！',
        success(res) {
          if (res.confirm) {
            that.signUp()
          }
        }
      })
    }
  },

  onLoad: function() {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        });
      }
    });

    wx.cloud.callFunction({
      name: 'selectUser',
      data: {},
      complete: res => {
        let t = (res.result.data.length > 0) ? true : false
        this.setData({
          isSignUp: t,
          loadComplete: true
        })
        app.globalData.userRecord = res.result.data[0]
        console.log(app.globalData.userRecord)
      }
    })

    /*if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
      })
    } else if (this.data.canIUse) {
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
    }*/

  },
  /*getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }*/
})