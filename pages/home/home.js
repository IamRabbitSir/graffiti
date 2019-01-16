Page({

  /**
   * 页面的初始数据
   */
  data: {
    a:true,
  },

  after: function (res) {
    wx.switchTab({
      url: '../index/index',
    })
  },


})
