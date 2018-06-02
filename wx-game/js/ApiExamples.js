/**
 * 进行xia哦游戏 API 测试
 */
export class ApiExamples {
  getUserInfo () {
    wx.getUserInfo({
      success: function (res) {
        console.log(res)
      }
    })
  }

  login() {
    wx.login({
      success: function (res) {
        console.log(res)
      }
    })
  }

  httpExample() {
    wx.request({
      url: 'http://127.0.0.1:8181/',
      method: 'POST',
      data: 'MyData',
      success: function (res) {
        console.log(res)
      }
    })
  }

  wsExample() {
    wx.connectSocket({
      url: 'ws://127.0.0.1:8282',
      success: function () {
        console.log('客户端连接成功')
      }
    })

    // 必须要打开了 ws 的时候才有用，发送数据必须在 wx.onSocketOpen 中进行
    wx.onSocketOpen(function () {
      wx.sendSocketMessage({
        data: '这个是来自客户端的实时数据'
      })

      wx.onSocketMessage(function (res) {
        console.log(res)
      })
    })
  }
}
