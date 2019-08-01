const sequelize = require('./model').sequelize
sequelize
  .authenticate()
  .then(() => {
    console.log('Success, 数据库连接成功.')
  })
  .catch(err => {
    console.error('数据库无法连接: ', err)
  })

sequelize.sync({force: true}).then(() => {
  console.log('数据库创建成功')
}).catch((err) => {
  console.log('数据库创建出错')
})
