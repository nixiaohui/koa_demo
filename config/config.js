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
        dialectOptions: {
          collate: 'utf8_general_ci'
        },
        timestamps: false
      }
    }
  }
}
