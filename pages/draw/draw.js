import CanvasDrag from '../../components/canvas-drag/canvas-drag'; 
Page({
  data:{
    x: 0, y: 0, z: 0, r: 1,
    rgba1:'rgba(0,0,0,1)',//调色板
    rgba2:'rgba(255,0,0,1)',
    rgba3:'rgba(0,0,255,1)',
    //rgba1: `rgba(${x1}, ${y1}, ${z1}, ${r1})`,
    //rgba2: `rgba(${x2}, ${y2}, ${z2}, ${r2})`,
    //rgba3: `rgba(${x3}, ${y3}, ${z3}, ${r3})`,
    pen : 2, //画笔粗细默认值
    color: '#000000', //画笔颜色默认值
    active_yzb: true,
    active_qb: false,
    active_sb: false,
    active_xb: false,
    active_box1: true,
    active_box2: false,
    active_box3: false,
    hidden: false,
    touchDotX: 0, //X按下时坐标
    touchDotY: 0, //y按下时坐标
    openSettingBtn: true,
    saveBtn:false,
    //画笔粗细
    leftMin: 1,
    leftMax: 6,
    hidden_slider: false,
    state: false,
    first_click: false,
    
    //颜色
    hiddenmodalput: true,
    graph: {},//画布上的图像
    select:1,//控制调色板选择项
    css_R: 'background-color: black;',
    css_G: 'background-color: red;',
    css_B: 'background-color: blue;',
    
  },
  eraser: 20, //橡皮
  screenHeight:1000,
  screenWidth:1000,
  startX: 0, //保存X坐标轴变量
  startY: 0, //保存X坐标轴变量
  isClear : false, //是否启用橡皮擦标记
  actions: [],

  
  
  //手指触摸动作开始
  onLoad: function (options) {
    wx.hideTabBar();
    var that = this;
    wx.getSystemInfo({
      success:function(res){
        that.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
        })
      }
    })
    
  },
  touchStart: function (e) {
      //得到触摸点的坐标
      this.startX = e.changedTouches[0].x
      this.startY = e.changedTouches[0].y
      this.context = wx.createCanvasContext("myCanvas",this)
      if(this.isClear){ //判断是否启用的橡皮擦功能  ture表示清除  false表示画画
         this.context.setStrokeStyle('#FFFFFF') //设置线条样式 此处设置为画布的背景颜色  
         //橡皮擦原理就是：利用擦过的地方被填充为画布的背景颜色一致 从而达到橡皮擦的效果 
         this.context.setLineCap('round') //设置线条端点的样式
         this.context.setLineJoin('round') //设置两线相交处的样式
         this.context.setLineWidth(this.eraser) //设置线条宽度
         this.context.save();  //保存当前坐标轴的缩放、旋转、平移信息
         this.context.beginPath() //开始一个路径 
         this.context.arc(this.startX,this.startY,5,0,2*Math.PI,true);  //添加一个弧形路径到当前路径，顺时针绘制  这里总共画了360度  也就是一个圆形 
         this.context.fill();  //对当前路径进行填充
      }else{
        this.context.setLineCap("round") 
        this.context.setLineJoin('round')
         this.context.setMiterLimit(3)
        this.context.setStrokeStyle(this.data.color)
         this.context.setLineWidth(this.data.pen)
          //var a = this.context.arc(this.startX, this.startY, 5, 0, 2 * Math.PI, true);
         this.context.beginPath()   
        //console.log(this.data.color);
      }
  },
  //手指触摸后移动
  touchMove: function (e) {
      var startX1 = e.changedTouches[0].x
      var startY1 = e.changedTouches[0].y
      if(this.isClear){ //判断是否启用的橡皮擦功能  ture表示清除  false表示画画
        this.context.save();  //保存当前坐标轴的缩放、旋转、平移信息
        this.context.moveTo(this.startX,this.startY);  //把路径移动到画布中的指定点，但不创建线条
        this.context.lineTo(startX1,startY1);  //添加一个新点，然后在画布中创建从该点到最后指定点的线条
        this.context.stroke();  //对当前路径进行描边
        this.context.restore()  //恢复之前保存过的坐标轴的缩放、旋转、平移信息       
        this.startX = startX1;
        this.startY = startY1;     
      }else{
        this.context.moveTo(this.startX, this.startY)
        this.context.lineTo(startX1, startY1)
        this.context.stroke()
        this.startX = startX1;
        this.startY = startY1;  
      }
      //只是一个记录方法调用的容器，用于生成记录绘制行为的actions数组。context跟<canvas/>不存在对应关系，一个context生成画布的绘制动作数组可以应用于多个<canvas/> 
      this.actions = this.context.getActions();
      wx.drawCanvas({
         canvasId: 'myCanvas',
         reserve: true,
         actions: this.actions // 获取绘图动作数组
      });
    this.context.save();    
  },
  //手指触摸动作结束
  touchEnd: function (e) {
      this.touchMove(e);
  },
  //启动橡皮擦方法
  clearCanvas: function(){
      this.setData({
        active_yzb: false,
        active_qb: false,
        active_sb: false,
        active_xb: true,
      })
      if(this.isClear){
        this.isClear = false;
      }else{
        this.isClear = true;
      }
  },
  ballpenSelect:function(e){//圆珠笔
    this.setData({
      pen: 2,
      active_yzb: true,
      active_qb: false,
      active_sb: false,
      active_xb: false,
    })
    this.isClear = false;
    var that = this;
    that.sliderPen();
  },
  waterPenSelect: function (e) {//水笔
    this.setData({
      pen: 3,
      active_yzb: false,
      active_qb: false,
      active_sb: true,
      active_xb: false,
    })
    this.isClear = false;
  },
  penSelect: function (e) { //铅笔
    this.setData({
      pen: 1,
      active_yzb: false,
      active_qb: true,
      active_sb: false,
      active_xb: false,
    })
    this.isClear = false;
  },
  sliderPen:function(e){//控制画笔粗细的工具开关
    if (this.data.hidden_slider==true){
      this.setData({
        hidden_slider: false
      })
    }
  },
  changeColorOne: function () {
    var that= this;
    that.setData({
      //rgba1: rgba1,
      select:1,
      color: that.data.rgba1,
      active_box1: true,
      active_box2: false,
      active_box3: false,
    })
  },
  changeColorTwo: function () {
    var that = this; 
    that.setData({
      //rgba2: rgba2,
      select: 2,
      color: that.data.rgba2,
      active_box1: false,
      active_box2: true,
      active_box3: false,
    })
  },
  changeColorThree: function () {
    var that = this; 
    that.setData({
      //rgba3: rgba3,
      select: 3,
      color: that.data.rgba3,
      active_box1: false,
      active_box2: false,
      active_box3: true,
    })
  },
  // 触摸开始事件
  viewTouchStart: function (e) {
    this.touchDotX = e.touches[0].pageX; // 获取触摸时的原点
    this.touchDotY = e.touches[0].pageY;    
  },
  // 触摸结束事件
  viewTouchEnd: function (e) {  
    var X = e.changedTouches[0].pageX;
    var Y = e.changedTouches[0].pageY;
    if ( this.touchDotY < Y-15) {
      this.setData({
        hidden: true,
      })
    }
  },
  save: function () {
    var that = this;
    //获取相册授权
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {//这里是用户同意授权后的回调
              that.savaImageToPhoto();
            },
            fail() {//这里是用户拒绝授权后的回调
              that.setData({
                openSettingBtn: false,
                saveBtn:true
              })
            }
          })
        } else {//用户已经授权过了
          that.savaImageToPhoto();
        }
      }
    })
  },
  handleSetting: function (e) {
    let that = this;
    // 对用户的设置进行判断，如果没有授权，即使用户返回到保存页面，显示的也是“去授权”按钮；同意授权之后才显示保存按钮
    if (!e.detail.authSetting['scope.writePhotosAlbum']) {
      wx.showModal({
        title: '警告',
        content: '若不打开授权，则无法将图片保存在相册中！',
        showCancel: false
      })
      that.setData({
        saveBtn: true,
        openSettingBtn: false
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '您已授权，赶紧将图片保存在相册中吧！',
        showCancel: false
      })
      that.setData({
        saveBtn: false,
        openSettingBtn: true
      })
    }
  },
  savaImageToPhoto: function () {
    let that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      canvasId: 'myCanvas',
      success: function (res) {
        wx.hideLoading()
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showModal({
              content: '图片已保存到相册了',
              showCancel: false,
              confirmText: '朕知道啦',
              confirmColor: '#72B9C3',
              success: function (res) {
                if (res.confirm) {
                  that.setData({
                    hidden: true
                  })
                }
              }
            })
          }
        })
      },
      fail: function (res) {
      }
    })
  },
  showScrollView: function (e) { //显示工具
    this.setData({
      hidden:false,
    })
  },
  //侧栏展开
  slideUp: function () {
    this.setData({
      maskDisplay: true,
      hidden_slider: true
    });
    var that = this;
    that.toggle();
  },
  //侧栏关闭
  slideDown: function (e) {
    this.setData({
      maskDisplay: false,
    });
    var that = this;
    that.toggle();
  },
  toggle: function () {
    var list_state = this.data.state,
      first_state = this.data.first_click;
    if (!first_state) {
      this.setData({
        first_click: true
      });
    }
    if (list_state) {
      this.setData({
        state: false
      });
    } else {
      this.setData({
        state: true
      });
    }
  },
  /**
     * 添加图片
     */
  onAddImage:function() {
    var that = this;
    wx.chooseImage({
      success: (res) => {
        that.setData({
          graph: {
            w: 200,
            h: 200,
            type: 'image',
            url: res.tempFilePaths[0],
          }
        });
      }
    })
  },
  //画笔粗细滑动
  leftSchange: function (e) {
    var that = this;
    var value = e.detail.value;
    that.setData({
      pen: value
    })
  },
  //清空画布
  clear:function(){
    var that = this;
    wx.showModal({
      title: '清空画布内容',
      content: '确认清空吗？',
      success: function (res) {
        if (res.confirm) {
          that.clearAll();
        } else {
        }
      }
    })
  },
  clearAll: function() {
    this.context = wx.createCanvasContext("myCanvas", this)
    this.context.setFillStyle('#000000'),
    this.context.clearRect(0, 0, this.screenWidth, this.screenHeight );
    this.context.draw();
   },
  //调色板
  showM: function (e) {//显示调色板
    this.setData({
      hiddenmodalput: false
    })
  },
  confirmM:function(e){//调取调色板modal，点'提交'
    var that = this;
    if (that.data.select==2) {
       that.setData({
         color:that.data.rgba2
       })
    } else if (that.data.select == 3){
      that.setData({
        color: that.data.rgba3
      })
    }else{
      that.setData({
        color: that.data.rgba1
      })
    };
    that.setData({   
      css_R:'background-color:'+ this.data.rgba1+';',
      css_G: 'background-color:' + this.data.rgba2 + ';',
      css_B: 'background-color:' + this.data.rgba3 + ';',
      hiddenmodalput: true
    })
  },

  rgba1Change: function (e) {//silder改变x的值
    var that = this;
    var value = e.detail.value;  
      that.setData({
        x: value,
      })
    
    that.rgbaChange();
  },
  rgba2Change: function (e) {//silder改变y的值
    var that = this;
    var value = e.detail.value;
    that.setData({
      y: value,
      
    })
    that.rgbaChange();
  },
  rgba3Change: function (e) {//silder改变z的值
    var that = this;
    var value = e.detail.value;
    that.setData({
      z: value,
    })
    that.rgbaChange();
  },
  rgba4Change: function (e) {//silder改变r的值
    var that = this;
    var value = e.detail.value;
    that.setData({
      r: value,
    })
    that.rgbaChange();
  },
  
  rgbaChange:function(e){
    var that = this;
    console.log(that.data.select);
    var rgba = 'rgba(' + that.data.x + ',' + that.data.y + ',' + that.data.z + ',' + that.data.r + ')';
    if(that.data.select == 2){
      this.setData({
        rgba2: rgba,
      })
    }
    else if (that.data.select == 3) {
      this.setData({
        rgba3: rgba,
      })
    }
    else {
      this.setData({
        rgba1: rgba,
      })
    }
  },
 
  R:function(e){
    var that = this;
    var arr = that.data.rgba1.split(',');
    var x = arr[0].substring(5)
    var y = parseInt(arr[1])
    var z = parseInt(arr[2])
    var r = parseFloat(arr[3])
    that.setData({
      select: 1,
      x:x,
      y:y,
      z:z,
      r:r,
    })
    that.changeColorOne();
  },
  G: function (e) {
    var that = this;
    var arr = that.data.rgba2.split(',');
    var x = arr[0].substring(5)
    var y = parseInt(arr[1])
    var z = parseInt(arr[2])
    var r = parseFloat(arr[3])
    that.setData({
      select: 2,
      x: x,
      y: y,
      z: z,
      r: r,
    })
    that.changeColorTwo();
  },
  B: function (e) {
    var that = this;
    var arr = that.data.rgba3.split(',');
    var x = arr[0].substring(5)
    var y = parseInt(arr[1])
    var z = parseInt(arr[2])
    var r = parseFloat(arr[3])
    that.setData({
      select: 3,
      x: x,
      y: y,
      z: z,
      r: r,
    })
    that.changeColorThree();
  },


  /**
       * 导出图片
       */
  onExport() {
    CanvasDrag.export()
      .then((filePath) => {
        wx.previewImage({
          urls: [filePath]
        })
      })
      .catch((e) => {
        console.error(e);
      })
  },

  /**
   * 回退一步
   */
  LastStep: function (e) {
    wx.navigateBack({})
  },
  NextStep: function (e) { //回退

  },

  
})