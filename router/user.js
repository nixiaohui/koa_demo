const Router = require('koa-router')
const userController = require('../controller/userController')
userRouter = new Router()

userRouter.get('/', userController.index)
userRouter.get('/items', userController.getAll)
userRouter.get('/item/:id', userController.getItem)
userRouter.post('/item', userController.addUser)
userRouter.get('/profile', userController.profile)
userRouter.post('/upload', userController.upload.single('avatar'), userController.update)
userRouter.post('/:id/group', userController.updateUserGroup)
userRouter.get('/:id/group', userController.getUserGroups)

module.exports = userRouter
