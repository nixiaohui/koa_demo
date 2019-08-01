const Router = require('koa-router')
const menuController = require('../controller/menuController.js')
const menu = new Router()

menu.get('/items', menuController.getItems)
menu.post('/item', menuController.addItem)
menu.post('/item/:id', menuController.editItem)
menu.delete('/item/:id', menuController.deleteItem)

module.exports = menu
