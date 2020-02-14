// pages/signup/signup.js
/*
  用于用户第一次使用时绑定另一个微信号
*/
const APP = getApp()
import Notify from '../miniprogram_npm/vant-weapp/notify/notify'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    invitedCode: "",
    isExist: false,
    id: "",
    value: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  input: function(event) {
    this.setData({
      value: event.detail
    })
    //console.log(event.detail)
  },

  confirm: function(event) {
    console.log(this.data.value)
    if (this.data.value.length == 0) {
      wx.showToast({
        title: '邀请码不能为空',
      })
    } else {
      wx.cloud.callFunction({
        name: 'selectInvitedCode',
        data: {
          type: 1,
          code: this.data.value
        },
        complete: res => {
          console.log(res)
          if (res.result.data.length == 1) {
            var rr = res.result.data[0]
            console.log(rr)
            wx.cloud.callFunction({
              name: 'addUser',
              data: {
                openid: rr._openid,
                code: rr._invitedCode
              },
              complete: res => {
                //删除相应的邀请码记录
                wx.cloud.callFunction({
                  name: 'deleteInvitedCode',
                  data: {
                    id: rr._id
                  },
                  complete: res => {
                    console.log(res)
                  }
                })
                APP.globalData.isSignUp = true

                wx.redirectTo({
                  url: '../main/main',
                })
              }
            })

          } else {
            console.error('invitedCode errors')

            Notify({
              type: 'warning',
              message: '无效邀请码!'
            });
          }
        }
      })
    }

  },

  //接受邀请
  receive: function() {

  },

  //生成邀请码
  generateCode: function() {
    var that = this
    wx.cloud.callFunction({
      name: 'randomCode',
      data: {},
      complete: res => {
        wx.setClipboardData({
          data: res.result,
        })
        that.selectDb(res.result, that)
        console.log('code:' + res.result);
      }
    })

  },

  //添加到云数据库
  addCode: function(code) {
    wx.cloud.callFunction({
      name: 'addInvitedCode',
      data: {
        _invitedCode: code
      }
    }).then(res => {
      console.log(res)
    })

  },

  updateCode: function(id, code) {
    console.log(id)

    wx.cloud.callFunction({
      name: 'updateInvitedCode',
      data: {
        _id: id,
        _invitedCode: code
      }
    }).then(res => {
      console.log(res)
    })
  },

  selectDb: function(code, that) {
    wx.cloud.callFunction({
      name: 'selectInvitedCode',
      data: {
        type: 0
      }
    }).then(res => {
      console.log(res)
      if (res.result.data.length == 0) {
        //增加
        that.addCode(code)
      } else {
        that.updateCode(res.result.data[0]._id, code)
      }
    }).catch(console.error)
  }
})