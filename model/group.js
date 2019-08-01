const Model = require('sequelize').Model

module.exports = (sequelize, DataTypes) => {
  class Group extends Model { }
  Group.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name:  {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    parent_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Group,
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Group',
    tableName: 'groups',
    timestamps: true,
    comment: '用户组表'
  })
  Group.associate = function(models) {
    models.Group.belongsToMany(models.User, {through: 'user_groups'})
    models.Group.belongsToMany(models.Role, {through: 'group_roles'})
  }
  return Group
}
