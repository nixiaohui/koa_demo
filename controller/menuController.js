const models = require('../model')

const getItems = async (ctx, next) => {
  const body = { code: 0, message: ''}
  let currentPage = ctx.query.page || 1
  let count = ctx.query.results || 10
  let offset = (currentPage - 1) * count
  await models.Menu.findAndCountAll({
    limit: parseInt(count),
    offset
  }).then((res) => {
    if (!res.rows) {
      body.code = -1
      body.message = '没有菜单记录，请添加'
    } else {
      body.code = 1
      body.message = '获取菜单成功'
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
  const id = ctx.params.id
  const newItem = await genNewItem(ctx)
  if (!newItem) {
    body.code = -1
    body.message = '菜单无法创建, 缺少参数'
  }
  const match = await matchItemById(id)
  if (!match) {
    body.code = -2
    body.message = '修改菜单失败，修改的菜单不存在'
  }
  const matchItem = await matchItemByTitle(newItem.title)
  if ( matchItem && matchItem.id !== parseInt(id)) {
    body.code = -3
    body.message = '修改菜单失败， 菜单标题已存在'
  }
  if (body.code === 0) {
    try {
      const item = await models.Menu.update(newItem, {
        where: {
          id: id
        }
      })
      body.code = 1
      body.message = '更新成功'
      body.menu_item = item.title
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
    body.message = '菜单无法创建, 缺少参数'
  }
  if (await matchItemByTitle(newItem.title)) {
    body.code = -3
    body.message = '菜单无法创建, 标题已存在...'
  }
  if (body.code === 0) {
    if (createItem(models.sequelize, models.Menu, models.Privilege, newItem)) {
      body.code = 1
      body.message = '菜单添加成功'
      body.item = newItem      
    } else {
      body.code = -9
      body.message = '菜单添加失败，请重试'
    }
  }
  ctx.body = body
}

module.exports = {
  getItems,
  deleteItem,
  editItem,
  addItem
}

const genNewItem = async (ctx) => {
  if (ctx.request.body && ctx.request.body.title) {
    let { title, url, sort_id, parent_id, icon } = ctx.request.body
    sort_id = sort_id ? parseInt(sort_id) : 0
    if (parent_id) {
      parent_id = parseInt(parent_id)
      if (parent_id ===0 ) {
        parent_id = null
      }
    }
    return { title, url, sort_id, parent_id, icon }
  } 
}

const matchItemByTitle = async (itemTitle) => {
  const item = await models.Menu.findOne({
    where: {
      title: itemTitle
    }
  })
  return item
}

const matchItemById = async (itemId) => {
  const item = await models.Menu.findOne({
    where: {
      id: itemId
    }
  })
  return item
}

const createItem = (sequelize, menu, privilege, item) => {
  let newItem
  // 启动一个不受管理的事务
  return sequelize.transaction().then(function (t) {
    // 一些在事务中进行的操作
    return menu.create(item, { 
      transaction: t
    }).then(menuItem => {
      newItem = menuItem
      return privilege.create({
        privilege_type: 'MENU'
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
      t.rollback()
      return false
    })
  })
}
