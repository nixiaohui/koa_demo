const models = require('../model')
const errorMessage = {
  PARAM_SHORT: '缺少参数',
  ITEM_EXISTED: '已经存在',
  OTHER: '操作失败'
}
const successMessage = {
  ADDED: '添加成功',
  QUERIED: '查询成功',
  UPDATED: '更新成功',
  DELETED: '删除成功'
}
const getItem = async (ctx, next) => {}

const getItems = async (ctx, next) => {
  const body = { code: 0, message: ''}
  let currentPage = ctx.query.page || 1
  let count = ctx.query.results || 10
  let offset = (currentPage - 1) * count
  await models.Group.findAndCountAll({
    limit: parseInt(count),
    offset
  }).then((res) => {
    if (!res.count) {
      body.code = 1
      body.message = '没有用户组别记录，请添加'
    } else {
      body.code = 1
      body.message = '获取用户组别成功'
    }
    body.count = res.count,
    body.items = res.rows
  }).catch((error) => {
    body.code = -9
    body.message = `数据库错误: ${error.message}`
  })
  ctx.body = body
}

const addItem = async (ctx, next) => {
  const body = {
    code: 0,
    message: ''
  }
  const newItem = await genNewItem(ctx)
  if (!newItem) {
    body.code = -1
    body.message = errorMessage.PARAM_SHORT
  }
  if (await matchItemByName(newItem.name)) {
    body.code = -3
    body.message = errorMessage.ITEM_EXISTED
  }
  if (body.code === 0) {
    let flag = await createItem(models.sequelize, models.Group, newItem)
    if (flag.code === 0) {
      body.code = 1
      body.message = successMessage.ADDED
      body.item = newItem      
    } else {
      body.code = -9
      body.message = errorMessage.OTHER
    }
  }
  ctx.body = body
}

const editItem = async (ctx, next) => {
  const body = {
    code: 0,
    message: ''
  }
  const id = parseInt(ctx.params.id)
  const newItem = await genNewItem(ctx)
  if (!newItem) {
    body.code = -1
    body.message = errorMessage.PARAM_SHORT
  }
  const match = await matchItemByName(newItem.name)
  if (match && match.id !== id) {
    body.code = -3
    body.message = errorMessage.ITEM_EXISTED
  }
  if (body.code === 0) {
    let flag = await updateItem(models.sequelize, models.Group, id, newItem)
    if (flag.code === 0) {
      body.code = 1
      body.message = successMessage.UPDATED
      body.item = newItem
    } else {
      body.code = -9
      body.message = errorMessage.OTHER
    }
  }
  ctx.body = body
}

const deleteItem = async (ctx, next) => {}

module.exports = {
  getItem,
  getItems,
  deleteItem,
  editItem,
  addItem
}

const genNewItem = async (ctx) => {
  if (ctx.request.body && ctx.request.body.name) {
    let { name, parent_id } = ctx.request.body
    if (parent_id) {
      if (parseInt(parent_id) === 0){
        parent_id = null
      }
    }
    return { name, parent_id }
  } 
}

const matchItemByName = async (itemName) => {
  const item = await models.Group.findOne({
    where: {
      name: itemName
    }
  }).then((res) => {
    return res
  }).catch((error) => {
    console.log(error.message)
  })
  return item
}

const matchItemById = async (itemId) => {
  const item = await models.Group.findOne({
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

const createItem = async (sequelize, cModel, item) => {
  let error = {code:0, message:''}
  // 启动一个不受管理的事务
  await sequelize.transaction().then(function (t) {
    // 一些在事务中进行的操作
    return cModel.create(item, { 
      transaction: t
    }).then(result => {
      // Transaction 会自动提交
      // result 是事务回调中使用promise链中执行结果
      t.commit()
    }).catch(err => {
      // Transaction 会自动回滚
      // err 是事务回调中使用promise链中的异常结果
      t.rollback()
      error.code = -9
      error.message = err.message
    })
  })
  return error
}

const updateItem = async (sequelize, cModel, id, item) => {
  let error = {code:0, message:''}
  // 启动一个不受管理的事务
  await sequelize.transaction().then(function (t) {
    // 一些在事务中进行的操作
    return cModel.update(item, { 
      where: {
        id: id
      },
      transaction: t
    }).then(result => {
      // Transaction 会自动提交
      // result 是事务回调中使用promise链中执行结果
      t.commit()
    }).catch(err => {
      // Transaction 会自动回滚
      // err 是事务回调中使用promise链中的异常结果
      console.log(err)
      t.rollback()
      error.code = -9
      error.message = err.message

    })
  })
  return error
}