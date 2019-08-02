const Router = require('koa-router')
const elementController = require('../controller/elementController.js')
const element = new Router()

element.get('/items', elementController.getItems)
element.post('/item', elementController.addItem)
element.get('/item/:id', elementController.getItem)
element.post('/item/:id', elementController.editItem)
element.delete('/item/:id', elementController.deleteItem)

module.exports = element
