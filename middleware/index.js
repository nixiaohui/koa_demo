const bodyParser = require('koa-bodyparser')
const static = require('koa-static')
const views = require('koa-views')
const path = require('path')
const responseTime = require('./responseTime.js')

const middleware = (app) => {
  app.use(bodyParser())
  app.use(static(path.join(__dirname, '../static')))
  app.use(views(path.join(__dirname, '../view'), {
    map: {
      html: 'nunjucks'
    }
  }))
  app.use(responseTime)
}

module.exports = middleware
