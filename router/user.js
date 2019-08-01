const Router = require('koa-router')
const userController = require('../controller/userController')
userRouter = new Router()

userRouter.get('/', userController.index)
userRouter.get('/items', userController.getAll)
userRouter.post('/item', userController.addUser)
userRouter.get('/profile', userController.profile)
userRouter.post('/upload', userController.upload.single('avatar'), userController.update)

module.exports = userRouter
