const models = require('../model')

const getItem = async (ctx, next) => {
  const body = { code: 0, message: ''}
  const { id } = ctx.params
  if (!id) {
    body.code = -2
    body.message = '缺少参数'
  } else {
    await models.Element.findOne({
      where: {
        id: id
      }
    }).then((res) => {
      if (!res) {
        body.code = -1
        body.message = '没有页面元素记录，请添加'
      } else {
        body.code = 1
        body.message = '获取页面元素成功'
        body.item = res
      }
    }).catch((error) => {
      body.code = -9
      body.message = `数据库错误: ${error.message}`
    })
  }
  ctx.body = body
}

const getItems = async (ctx, next) => {
  const body = { code: 0, message: ''}
  let currentPage = ctx.query.page || 1
  let count = ctx.query.results || 10
  let offset = (currentPage - 1) * count
  await models.Element.findAndCountAll({
    limit: parseInt(count),
    offset
  }).then((res) => {
    if (!res.rows) {
      body.code = -1
      body.message = '没有页面元素记录，请添加'
    } else {
      body.code = 1
      body.message = '获取页面元素成功'
      body.count = res.count,
      body.items = res.rows
    }
  }).catch((error) => {
    body.code = -9
    body.message = `数据库错误: ${error.message}`
  })
  ctx.body = body
}

const deleteItem = async (ctx, next) => {
  if (ctx.params.id) {
    const id = ctx.params.id
    try {
      let menu_item = await models.Menu.destroy({
        where: {
          id: id
        }
      })
      ctx.body = {
        code: 1,
        message: '删除成功',
        menu_item: menu_item
      }
    } catch (error) {
      ctx.body = {
        code: -1,
        message: '删除失败: ' + error.message
      }
    }
  } else {
    ctx.body ={
      code: -2,
      message: '缺少参数'
    }
  }
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
    body.message = '页面元素无法修改, 缺少参数'
  }
  const match = await matchItemById(id)
  if (!match) {
    body.code = -2
    body.message = '修改页面元素失败，修改的页面元素不存在'
  }
  const matchItem = await matchItemByTag(newItem.tag)
  if ( matchItem && matchItem.id !== id) {
    body.code = -3
    body.message = '修改页面元素失败，页面元素标签已存在'
  }
  if (body.code === 0) {
    try {
      await models.Element.update(newItem, {
        where: {
          id: id
        }
      })
      body.code = 1
      body.message = '更新成功'
      body.item = newItem
    } catch (error) {
      body.code = -9
      body.message = `更新错误, ${error.message}`
    }
  }
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
    body.message = '页面元素无法创建, 缺少参数'
  }
  if (await matchItemByTag(newItem.tag)) {
    body.code = -3
    body.message = '页面元素无法创建, 标题已存在...'
  }
  if (body.code === 0) {
    if (createItem(models.sequelize, models.Element, models.Privilege, newItem, 'ELEMENT')) {
      body.code = 1
      body.message = '页面元素添加成功'
      body.item = newItem      
    } else {
      body.code = -9
      body.message = '页面元素添加失败，请重试'
    }
  }
  ctx.body = body
}

module.exports = {
  getItem,
  getItems,
  deleteItem,
  editItem,
  addItem
}

const genNewItem = async (ctx) => {
  if (ctx.request.body && ctx.request.body.tag) {
    let { tag, description } = ctx.request.body
    return { tag, description }
  } 
}

const matchItemByTag = async (itemTag) => {
  const item = await models.Element.findOne({
    where: {
      tag: itemTag
    }
  }).then((res) => {
    return res
  }).catch((error) => {
    console.log(error.message)
  })
  return item
}

const matchItemById = async (itemId) => {
  const item = await models.Element.findOne({
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

const createItem = (sequelize, cModel, privilege, item, type) => {
  let newItem
  // 启动一个不受管理的事务
  return sequelize.transaction().then(function (t) {
    // 一些在事务中进行的操作
    return cModel.create(item, { 
      transaction: t
    }).then(result => {
      newItem = result
      return privilege.create({
        privilege_type: type
      }, {
        transaction: t  //注意（事务transaction 须和where同级）second parameter is "options", so transaction must be in it
      })
    }).then(privilegeItem => {
      return newItem.setPrivilege(privilegeItem, {
        transaction: t
      })
    }).then(result => {
      // Transaction 会自动提交
      // result 是事务回调中使用promise链中执行结果
      t.commit()
      return true
    }).catch(err => {
      // Transaction 会自动回滚
      // err 是事务回调中使用promise链中的异常结果
      console.log(err.message)
      t.rollback()
      return false
    })
  })
}