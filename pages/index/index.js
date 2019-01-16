
Page({

  data: {
    img_width_three: 60,
    img_width_one: 60,
    clubs: [
      '/images/1.jpg',
      '/images/2.jpg',
      '/images/3.jpg',
    ],
  },
  //触摸开始事件
  touchstart: function (e) {
    this.data.touchDot = e.touches[0].pageX;
    var that = this;
    this.data.interval = setInterval(function () {
      that.data.time += 1;
    }, 100);
  },
  //触摸移动事件
  touchmove: function (e) {
    let touchMove = e.touches[0].pageX;
    let touchDot = this.data.touchDot;
    let time = this.data.time;
    //向左滑动
    if (touchMove - touchDot <= -40 && !this.data.done) {
      this.data.done = true;
      this.scrollLeft();
    }
    //向右滑动
    if (touchMove - touchDot >= 40 && !this.data.done) {
      this.data.done = true;
      this.scrollRight();
    }
  },
  //触摸结束事件
  touchend: function (e) {
    clearInterval(this.data.interval);
    this.data.time = 0;
    this.data.done = false;
  },
  //向左滑动事件
  scrollLeft() {
    var animation1 = wx.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0
    })
    var animation2 = wx.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0
    })
    var animation3 = wx.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0
    })
    this.setData({
      img_width_three: 200
    })
    this.animation1 = animation1;
    this.animation2 = animation2;
    this.animation3 = animation3;
    this.animation1.translateX(-60).opacity(0.5).step();
    this.animation2.translateX(-60).opacity(1).scale(0.8, 0.8).step();
    this.animation3.translateX(-60).opacity(0.5).scale(1.2, 1.2).step();
    this.setData({
      animation1: animation1.export(),
      animation2: animation2.export(),
      animation3: animation3.export(),
    })
    var that = this;
    setTimeout(function () {
      that.animation1.translateX(0).opacity(0.5).step({ duration: 0, timingFunction: 'linear' });
      that.animation2.translateX(0).opacity(1).scale(1, 1).step({ duration: 0, timingFunction: 'linear' });
      that.animation3.translateX(0).opacity(0.5).scale(1, 1).step({ duration: 0, timingFunction: 'linear' });
      that.setData({
        animation1: animation1.export(),
        animation2: animation2.export(),
        animation3: animation3.export(),
        img_width_three: 60
      })
    }.bind(this), 300)
    let array = this.data.clubs;
    let shift = array.shift();
    array.push(shift);

    setTimeout(function () {
      this.setData({
        clubs: array
      })
    }.bind(this), 195)
  },
  //向右滑动事件
  scrollRight() {
    var animation1 = wx.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0
    })
    var animation2 = wx.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0
    })
    var animation3 = wx.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0
    })
    var animation4 = wx.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0
    })
    var animation5 = wx.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0
    })
    this.setData({
      img_width_one: 200
    })
    this.animation1 = animation1;
    this.animation2 = animation2;
    this.animation3 = animation3;
    this.animation1.translateX(60).opacity(0.5).scale(1.2, 1.2).step();
    this.animation2.translateX(60).opacity(1).step();
    this.animation3.translateX(60).opacity(0.5).step();
    this.setData({
      animation1: animation1.export(),
      animation2: animation2.export(),
      animation3: animation3.export(),
    })
    var that = this;
    setTimeout(function () {
      that.animation1.translateX(0).opacity(0.5).scale(1, 1).step({ duration: 0, timingFunction: 'linear' });
      that.animation2.translateX(0).opacity(1).scale(1, 1).step({ duration: 0, timingFunction: 'linear' });
      that.animation3.translateX(0).opacity(0.5).step({ duration: 0, timingFunction: 'linear' });
      that.setData({
        animation1: animation1.export(),
        animation2: animation2.export(),
        animation3: animation3.export(),
        img_width_one: 60
      })
    }.bind(this), 300)

    let array = this.data.clubs;
    let pop = array.pop();
    array.unshift(pop);

    setTimeout(function () {
      this.setData({
        clubs: array
      })
    }.bind(this), 195)
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    var num1 = '/images/' + Math.floor(Math.random() * 4) + '.jpg'
    var num2 = '/images/' + Math.floor(Math.random() * 3 + 4) + '.jpg'
    var num3 = '/images/' + Math.floor(Math.random() * 3 + 7) + '.jpg'
    this.setData({
      clubs: [num1, num2, num3]
    })
    wx.stopPullDownRefresh();
  },
})