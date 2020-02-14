const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ownList: [],
    sentList: [],
    usedList: [],
    windowHeight: 0,
    titleHeight: 0,
    tabHeight: 0,
    scrollViewHeight: 0,
    swiperHeight: 0,
    active: 0,
    show: false,
    dataReady: false,
    dataReadyNum: 0,
    userInfo: null
  },

  test: function() {
    let t = this.data.ownList
    t.push({
      id: "1244",
      type: "我用过的",
      num: 1,
      time: "2019-10-3"
    })
    this.setData({
      ownList: t
    })
  },

  //帮助
  help: function(e) {
    this.setData({
      show: true
    });
  },

  onClose: function() {
    this.setData({
      show: false
    });
  },

  findIndex: function(id, array) {
    for (var i = 0; i < array.length; i++) {
      if (array[i]._id == id)
        break
    }
    if (i == array.length) {
      console.error('out of range')
      return -1
    } else
      return i
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (app.globalData.userInfo) {
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
    }

    let that = this;
    //console.log(this.data.list)

    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowHeight: res.windowHeight
        });
      }
    });

    let query = wx.createSelectorQuery().in(that);
    query.select('#title').boundingClientRect();
    query.select('#tab').boundingClientRect();

    query.exec(res => {
      this.data.titleHeight = res[0].height;
      this.data.tabHeight = res[1].height;

      this.setData({
        swiperHeight: this.data.windowHeight - this.data.titleHeight,
        scrollViewHeight: this.data.windowHeight - this.data.titleHeight - this.data.tabHeight
      });
    })

    /*
    初始化内容区
    */
    //this.getInfomation();
    this.getData(0)

    this.getData(1)

    this.getData(2)
    //console.log(this.data.dataReady)
  },

  /*
  标签滑动切换
  */
  /*swiperTab: function(e) {
    this.setData({
      currentTab: e.detail.current
    });
    console.log(e.detail.current);
    this.getInfomation();
  },*/

  /*
  标签点击切换
  */
  clickTab: function(e) {
    if (this.data.active == e.target.dataset.current) {
      return false;
    } else {
      this.setData({
        active: e.target.dataset.current
      })
    }
    console.log(e.target.dataset.current);
    //this.getInfomation();
  },

  /*
  获得当前标签数据
  @param: 
  t : 0,1,2
  */
  getData: function(t) {
    let that = this
    wx.cloud.callFunction({
      name: 'getList',
      data: {
        type: t
      },
      complete: res => {
        console.log(res)
        let list = null

        if (res.result != null) {
          list = res.result.data
        }

        if (t == 0) {
          that.setData({
            ownList: list
          })
        } else if (t == 1) {
          that.setData({
            sentList: list
          })
        } else if (t == 2) {
          that.setData({
            usedList: list
          })
        }

        console.log(list)

        that.addDataReady()
      }
    })

  },

  addDataReady: function() {
    if (!this.data.dataReady) {
      let t = this.data.dataReadyNum + 1
      this.setData({
        dataReadyNum: t
      })
    }
    if (this.data.dataReadyNum == 3) {
      this.setData({
        dataReady: true
      })
      console.log(this.dataReady)
    }
  },

  /*
  点击使用按钮后的确认信息
  */
  useTickets: function(targetId) {
    let that = this
    let uList = that.data.usedList
    let oList = that.data.ownList
    wx.showModal({
      title: '确定？',
      content: '是否现在就使用？(该操作无法撤销)',
      success(res) {
        if (res.confirm) {
          let index = that.findIndex(targetId, oList)
          wx.cloud.callFunction({
            name: 'useTickets',
            data: {
              id: targetId
            },
            complete: res => {
              wx.showToast({
                title: '使用成功',
              })
              uList.push(that.data.ownList[index])
              oList.splice(index, 1)

              that.setData({
                usedList: uList,
                ownList: oList
              })
            }
          })
        } else if (res.cancel) {
          wx.showToast({
            title: '已取消',
          })
        }
      }
    })
  },

  deleteTickets: function(targetId, tag) {
    let that = this
    let list = []
    if (tag == 0) {
      list = this.data.ownList
    } else if (tag == 1) {
      list = this.data.sentList
    } else if (tag == 2) {
      list = this.data.usedList
    } else {
      console.error('tag error')
      return;
    }

    let index = this.findIndex(targetId, list)

    wx.showModal({
      title: '是否删除',
      content: '不可逆',
      success: res => {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'deleteTickets',
            data: {
              id: targetId
            },
            complete: res => {
              list.splice(index, 1)
              if (tag == 0) {
                that.setData({
                  ownList: list
                })
              } else if (tag == 1) {
                that.setData({
                  sentList: list
                })
              } else if (tag == 2) {
                that.setData({
                  usedList: list
                })
              }
              wx.showToast({
                title: '已删除',
              })
            }
          })
        }
      }
    })
  },

  onClosePopup: function() {
    this.setData({
      show: false
    });
  },

  onClose: function(event) {
    const {
      position,
      instance
    } = event.detail;
    console.log(event)
    console.log(instance)
    switch (position) {
      case 'left':
        this.useTickets(event.currentTarget.id)
      case 'cell':
        instance.close();
        break;
      case 'right':
        /*Dialog.confirm({
          message: '确定删除吗？'
        }).then(() => {
          wx.cloud.callFunction({
            name:'deleteTickets',
            data:{
              id: 
            }
          })
        }).catch(() =>{

        }) */
        this.deleteTickets(
          event.currentTarget.id,
          event.currentTarget.dataset.tag
        )
        break;
    }
  },

})