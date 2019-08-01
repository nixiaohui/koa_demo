const Model = require('sequelize').Model

module.exports = (sequelize, DataTypes) => {
  class Privilege extends Model { } 
  Privilege.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    privilege_type: {
      type: DataTypes.ENUM,
      values: ['MENU', 'ELEMENT', 'FILE', 'OPERATION', 'OTHER'],
      allowNull: false,
      comments: '1:菜单权限,2:页面元素,3:文件资源,4:功能操作,5:其他权限'
    }
  }, {
    sequelize,
    modelName: 'Privilege',
    tableName: 'privileges',
    timestamps: true,
    comments: '权限总表'
  })
  Privilege.associate = function(models) {
    models.Privilege.belongsToMany(models.Menu, {through: 'privilege_menus'})
    models.Privilege.belongsToMany(models.Element, {through: 'privilege_elements'})
    models.Privilege.belongsToMany(models.Operation, {through: 'privilege_operations'})
  }

  return Privilege
}
