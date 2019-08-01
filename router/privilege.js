const Router = require('koa-router')
const privilegeController = require('../controller/privilegeController.js')
const privilege = new Router()

privilege.get('/items', privilegeController.getItems)
privilege.post('/item', privilegeController.addItem)
privilege.post('/item/:id', privilegeController.updateItem)
privilege.delete('/item/:id', privilegeController.deleteItem)

module.exports = privilege
