const Router = require('koa-router')
const groupController = require('../controller/groupController.js')
const group = new Router()

group.get('/items', groupController.getItems)
group.post('/item', groupController.addItem)
group.get('/item/:id', groupController.getItem)
group.post('/item/:id', groupController.editItem)
group.delete('/item/:id', groupController.deleteItem)

module.exports = group