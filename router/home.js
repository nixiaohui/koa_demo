const Router = require('koa-router')
const homeController = require('../controller/homeController')
const homeRouter = new Router()

homeRouter.get('/', homeController.index)
homeRouter.get('/error', homeController.error)
homeRouter.get('/:name/:age', homeController.getParams)
homeRouter.post('/', homeController.getBody)


module.exports = homeRouter
