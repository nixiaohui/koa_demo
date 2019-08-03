const multer = require('koa-multer')
const models = require('../model')
const { encrypt, decrypt } = require('../utils/crypt.js')

const errorMessage = {
  FETCH_NONE: '查不到记录',
  PARAM_SHORT: '缺少参数',
  ITEM_EXISTED: '已经存在',
  QUERY_ERR: '查询失败',
  OTHER: '操作失败'
}

const successMessage = {
  ADDED: '添加成功',
  QUERIED: '查询成功',
  UPDATED: '更新成功',
  DELETED: '删除成功'
}

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

const getItem = async (ctx, next) => {
  const body = { code: 0, message: ''}
  const id = parseInt(ctx.params.id)
  console.log(id)
  const item = await models.User.findOne({
    where: {
      id: id
    }
  }).then((res) => {
    body.message = successMessage.QUERIED
    body.code = 1
    return res
  }).catch((err) => {
    body.message = errorMessage.QUERY_ERR
    bdoy.code = -9
  })
  body.item = item
  ctx.body = body
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

const updateUserGroup = async (ctx, next) => {
  const body = {code:0,message:''}
  const id = ctx.params.id
  const groups = ctx.request.body.groups
  const match = await matchItemById(models.User, id)
  if (!match) {
    body.code = -1
    body.message = errorMessage.FETCH_NONE
  }
  if (body.code === 0) {
    try {
      const res = await createUserGroup(id, groups)
      if (res.code === 1) {
        body.code = 1
        body.message = successMessage.UPDATED
      } else {
        body.code = res.code
        body.message = errorMessage.OTHER
        console.log(res.message)
      }
    }catch(error) {
      body.code = -9
      body.message = errorMessage.OTHER
    }
  }
  ctx.body = body
}

const getUserGroups = async (ctx, next) => {
  const body = {code:0,message:''}
  const id = ctx.params.id
  await models.User.findOne({
    where: {
      id: id
    },
    include: [
      {
        attributes: ['id', 'name'],
        model: models.Group
      }
    ]
  }).then((res) => {
     if (res) {
        body.items = res
        body.code = 1
        body.message = successMessage.QUERIED
     } else {
       body.code = -1
       body.message = errorMessage.FETCH_NONE
     }
  }).catch((err) => {
    body.code = -9
    body.message = errorMessage.OTHER
  })
  ctx.body =  body
}

module.exports = {
  index,
  getAll,
  getItem,
  addUser,
  profile,
  upload,
  update,
  updateUserGroup,
  getUserGroups
}

const matchItemById = async (model, itemId) => {
  const item = await model.findOne({
    // 'attributes': ['id','username'],
    where: {
      id: itemId
    }
  }).then((result) =>{
    return result  
  }).catch((error) =>{
    console.log(error.message)
  })
  return item
}

const createUserGroup = async (userID, groups) => {
  const body = { code:0, message:''}
  await models.User.findOne({
    where: {
      id: userID
    }
  }).then((res) => {
    return res.setGroups(groups)
  }).then((res) => {
    body.code = 1
    body.message = res
  }).catch((err) => {
    body.code = -9
    body.message = err.message
  })
  return body
}