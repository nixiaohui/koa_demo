const Model = require('sequelize').Model
module.exports = (sequelize, DataTypes) => {
  class User extends Model { }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true
  })
  User.associate = function(models) {
    models.User.belongsToMany(models.Role, {through: 'user_roles'})
    models.User.belongsToMany(models.Group, {through: 'user_groups'})
  }  
  return User
}
