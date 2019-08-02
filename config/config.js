module.exports = {
  development: {
    sequelize: {
      database: 'rbac',
      username: 'root',
      password: 'root',
      dialect: 'mysql',
      host: 'localhost',
      logging: false,
      define: {
        charset: 'utf8',
        'underscored': true,  // 字段以下划线（_）来分割（默认是驼峰命名风格）
        dialectOptions: {
          collate: 'utf8_general_ci'
        },
        timestamps: false
      }
    }
  }
}
