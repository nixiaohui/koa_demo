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
      attributes: ['id', 'privilege_type'],
      include: [{
        model: models.Menu,
        attributes: ['title']
      },{
        model: models.Operation,
        attributes: ['tag']
      }, {
        model: models.Element,
        attributes: ['tag']
      }],
      limit: parseInt(count),
      offset
    })
    body.code = 1
    body.message = '获取菜单成功'
    body.count = privileges.count
    body.privilege_items = privileges.rows
  } catch (error) {
    body.code = -9
    body.message = `数据库查询错误：${error.message}`
  }
  ctx.body = body
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
