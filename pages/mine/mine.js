Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['全部', '计算机网络', '算法', '数据结构', 'linux'],
    type: 0,
    choseQuestionBank: "点击选择",
    indicate:false,
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
    
  },
  // 遮罩层显示
  show: function () {
    this.setData({ flag: false })
  },
  // 遮罩层隐藏
  conceal: function () {
    this.setData({ flag: true })
  },
  //开启转发指南
  indicateTap:function(e){
    this.setData({
      indicate: true, 
    })
  },
  //关闭转发指南
  outdicateTap: function (e) {
    this.setData({
      indicate: false,
    })
  },
  bindPickerChange: function (e) {

    var that = this

    //console.log('picker发送选择改变，携带值为', e.detail.value)

    this.setData({

      type: e.detail.value,

      choseQuestionBank: that.data.array[e.detail.value]

    })

  },
})

