const Koa = require('koa')
const middleware = require('./middleware')
const router = require('./router')

const app = new Koa()

middleware(app)
router(app)

app.listen(8000, () => {
  console.log('server on http://127.0.0.1:8000')
})
