const Router = require('koa-router')
const home = require('./home')
const user = require('./user')
const menu = require('./menu')
const privilege = require('./privilege')
const element = require('./element')
const group = require('./group')
const errorController = require('../controller/errorController.js')

const router = new Router()

router.use('/home', home.routes(), home.allowedMethods())
router.use('/user', user.routes(), user.allowedMethods())
router.use('/menu', menu.routes(), menu.allowedMethods())
router.use('/privilege', privilege.routes(), privilege.allowedMethods())
router.use('/element', element.routes(), element.allowedMethods())
router.use('/group', group.routes(), group.allowedMethods())

router.get('404', 'html/404.html')
router.get('500', 'html/500.html')

module.exports = (app) => {
  app.use(errorController)
  app.use(router.routes(), router.allowedMethods())
}
