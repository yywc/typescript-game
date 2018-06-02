/**
 * 模拟服务器，接受前端小游戏的 http 请求
 */

const http = require('http')
http
  .createServer(function (request, response) {
    let body = ''

    request.on('data', function (chunk) {
      body += chunk
    })
    // 请求结束
    request.on('end', function () {
      response.end('这是服务器传来的数据')
      console.log(body)
    })
  })
  .listen(8181)
