const Model = require('sequelize').Model

module.exports = (sequelize, DataTypes) => {
  class Role extends Model { }
  Role.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name:  {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Role',
    tableName: 'roles',
    timestamps: true,
    comment: '角色表'
  })
  Role.associate = function(models) {
    models.Role.belongsToMany(models.User, {through: 'user_roles'})
    models.Role.belongsToMany(models.Group, {through: 'group_roles'})
  }  
  return Role
}
