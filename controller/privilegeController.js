const models = require('../model')

const body = {
  code: 0,
  message: ''
}

const getItems = async (ctx, next) => {
  let currentPage = ctx.query.page || 1
  let count = ctx.query.results || 10
  let offset = (currentPage - 1) * count
  try {
    const privileges = await models.Privilege.findAndCountAll({
      attributes: ['id', 'type'],
      include: [{
        model: models.Menu,
        as: 'menu',
        attributes: ['title']
      }],
      limit: parseInt(count),
      offset
    })
    console.log(privileges)
  } catch (error) {
    console.log(error.message)
    ctx.body = {
      code: -1
    }
  }
  console.log('bb')
  ctx.body = {
    code: 1,
    message: '获取菜单成功',
    count: privileges.count,
    privilege_items: privileges.rows
  }
}

const deleteItem = async (ctx, next) => {
  
}

const updateItem = async (ctx, next) => {
  
}

const addItem = async (ctx, next) => {
  
}

module.exports = {
  getItems,
  deleteItem,
  updateItem,
  addItem
}