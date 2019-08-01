const multer = require('koa-multer')
const models = require('../model')
const { encrypt, decrypt } = require('../utils/crypt.js')

const addUser = async (ctx, next) => {
  let error = []
  if (ctx.request.body && ctx.request.body.username && ctx.request.body.password && ctx.request.body.email) {
    const { username, password, email } = ctx.request.body
    const matchErrorUsername = await matchUsername(username)
    const matchErrorEmail = await matchEmail(email)
    console.log(ctx.request.body)
    if (matchErrorEmail) {
      error.push('邮箱已存在')
    }
    if (matchErrorUsername) {
      error.push('用户名已存在')
    }
    if (error.length === 0) {
      const hash = await encrypt(password)
      try {
        const newUser = await models.User.create({
          username: username,
          email: email,
          password: hash
        })
        ctx.body = {
          code: 1,
          message: '用户创建成功',
          user: newUser.username
        }
      } catch (error) {
         ctx.body = {
          code: -1,
          message: '用户创建失败',
          error: error
         }       
      }
    } else {
      ctx.body = {
        code: -1,
        message: '用户创建失败',
        error: error
       }
    }
  } else {
    ctx.body = {
      code: 2,
      message: '参数不足'
    }
  }
}

const matchUsername = async (username) => {
  const match = await models.User.findOne({
    where: {
      username: username
    }
  })
  console.log('matchUsername')
  return match
}

const matchEmail = async (email) => {
  const match = await models.User.findOne({
    where: {
      email: email
    }
  })
  return match
}

const index = async(ctx, next) => {
  await ctx.render('user/index', {
    user: {
      name: 'All'
    }
  })
}

const getAll = async (ctx, next) => {
  const users = await models.User.findAll()
  ctx.body = {
    code: 1,
    message: '用户数据获取成功',
    users: users
  }
}

const profile = async(ctx, next) => {
  await ctx.render('user/profile')
}

//文件上传
//配置
let storage = multer.diskStorage({
    //文件保存路径
    destination: function(req, file, cb) {
      cb(null, 'static/upload/')
    },
    //修改文件名称
    filename: function(req, file, cb) {
      var fileFormat = (file.originalname).split(".") //以点分割成数组，数组的最后一项就是后缀名
      cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1])
    }
  })
  //加载配置
const upload = multer({ storage: storage })

const update = async(ctx, next) => {
  ctx.body = {
    filename: ctx.req.file.filename //返回文件名
  }
}

module.exports = {
  index,
  getAll,
  addUser,
  profile,
  upload,
  update
}
