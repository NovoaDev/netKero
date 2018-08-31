var express = require('express')
var web = express()
var api = require('./view/Router')

var servidor
var port = 3000

web.use(express.static('public'))
web.use(api)

servidor = web.listen(port, function () {
  console.log('Arrancoo el Server puerto: ' + port + '!.')
})
