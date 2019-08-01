const models = require('../model')

const getItems = async (ctx, next) => {
  let currentPage = ctx.query.currentPage || 1
  let count = ctx.query.count || 10
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
  if (ctx.request.body && ctx.request.body.title && ctx.params.id) {
    const id = ctx.params.id
    const { title, url, icon, sort_id, parent_id } = ctx.request.body
    try {
      await models.Menu.update({
        title: title,
        url: (url ? url : ''),
        icon: (icon ? icon : ''),
        sort_id: (sort_id ? parseInt(sort_id) : 0),
        parent_id: (parent_id ? parseInt(parent_id) : null)
      }, {
        where: {
          id: id
        }
      })
      ctx.body = {
        code: 1,
        message: '更新成功',
        menu_item: title
      }
    } catch (error) {
      ctx.body = {
        code: -1,
        message: '更新错误'
      }
    }
  } else {
    ctx.body = {
      code: -2,
      message: '缺少参数'
    }
  }
}

const addItem = async (ctx, next) => {
  if (ctx.request.body && ctx.request.body.title) {
    const { title, url, sort_id, parent_id, icon } = ctx.request.body
    try {
      const newMenuItem = await models.Menu.create({
        title: title,
        url: (url ? url : ''),
        icon: (icon ? icon : ''),
        sort_id: (sort_id ? parseInt(sort_id) : 0),
        parent_id: (parent_id ? parseInt(parent_id) : null)
      })
      ctx.body = {
        code: 1,
        message: '菜单添加成功',
        menu_item: newMenuItem
      }
    } catch (error) {
      console.log('发生错误：' + error)
    }
  } else {
    ctx.body = 'bbb'
  }
}

module.exports = {
  getItems,
  deleteItem,
  editItem,
  addItem
}
