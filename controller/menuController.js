const models = require('../model')
const body = {
  code: 0,
  message: ''
}
const getItems = async (ctx, next) => {
  let currentPage = ctx.query.page || 1
  let count = ctx.query.results || 10
  let offset = (currentPage - 1) * count
  const MenuItems = await models.Menu.findAndCountAll({
    limit: parseInt(count),
    offset
  })
  ctx.body = {
    code: 1,
    message: '获取菜单成功',
    count: MenuItems.count,
    menu_items: MenuItems.rows
  }
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
  const id = ctx.params.id
  const newItem = await genNewItem(ctx)
  const match = await matchItemById(id)
  if (!match) {
    body.code = -2
    body.message = '修改菜单失败，修改的菜单不存在'
  }
  const matchItem = await matchItemByTitle(newItem.title)
  if ( matchItem || matchItem.id !== id) {
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
      body.code = -9,
      body.message = `更新错误, ${error.message}`
    }
  }
  ctx.body = body
}

const addItem = async (ctx, next) => {
  const newItem = await genNewItem(ctx)
  if (await matchItemByTitle(newItem.title)) {
    body.code = -3,
    body.message = '菜单无法创建, 标题已存在...'
  }
  if (body.code === 0) {
    try {
      const newMenuItem = await models.Menu.create(newItem)
      const newPrivilegeItem = await models.Privilege.create({privilege_type: 'MENU'})
      newMenuItem.addPrivilege(newPrivilegeItem)
      body.code = 1
      body.message = '菜单添加成功',
      body.menu_item = newMenuItem.title
    } catch (error) {
      body.code = -9,
      body.message = `菜单添加失败, ${error.message}`
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
    parent_id = parent_id ? parseInt(parent_id) : null
    return { title, url, sort_id, parent_id, icon }
  } else {
    body.code = -1
    body.message = '菜单无法创建, 缺少参数'
    return {}
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