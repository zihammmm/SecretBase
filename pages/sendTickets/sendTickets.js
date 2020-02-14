// pages/sendTickets/sendTickets.js
const app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    option1: [{
        text: '1张',
        value: 1
      },
      {
        text: '2张',
        value: 2
      }
    ],
    value1: 1,
    userTicketType: [],
    defaultTicketType: [{
      name: 0,
      value: '亲亲券'
    },{
      name: 1,
      value: '抱抱券'
    }],
    showModal: false,
    inputValue: "",
    radio: '0',
    description: '',
    comment:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //加载本地票类缓存
    let that = this
    wx.getStorage({
      key: 'tickets',
      success: function(res) {
        //console.log(res.data)
        that.setData({
          userTicketType: res.data
        })
      },
    })
  },

  addType: function() {
    this.setData({
      showModal: true
    })

  },

  modalCancel: function() {
    this.setData({
      showModal: false
    })
  },

  modalConfirm: function() {
    let t = this.data.userTicketType

    t.push({
      name: t.length+this.data.defaultTicketType.length,
      value: this.data.inputValue
    })

    this.setData({
      showModal: false,
      userTicketType: t
    })

    wx.setStorage({
      key: 'tickets',
      data: this.data.userTicketType,
    })
    console.log(this.data.inputValue)
    console.log(this.data.userTicketType)
  },

  send: function() {
    let t = this.data.defaultTicketType.concat(this.data.userTicketType)
    console.log(t)
    wx.cloud.callFunction({
      name: 'addTickets',
      data: {
        userRecord: app.globalData.userRecord,
        name: t[this.data.radio].value,
        desc: this.data.description,
        comment: this.data.comment
      },
      complete: res=>{
        console.log(res)
        wx.showToast({
          title: '已发送',
          icon: 'success',
          complete: res =>{
            setTimeout(
              function(){
                wx.navigateBack({
                })
              }
              ,
              1500
            )
          }
        })
      }
    })
  },

  cancel: function() {
    wx.navigateBack({
    })
  },

  bindValueInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  radioOnChange: function(e){
    this.setData({
      radio: e.detail
    })
  },

  descOnChange: function(e){
    this.setData({
      description: e.detail
    })
  },

  comOnChange: function(e){
    this.setData({
      comment: e.detail
    })
  }
})