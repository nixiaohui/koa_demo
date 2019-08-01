const Model = require('sequelize').Model

module.exports = (sequelize, DataTypes) => {
  class PrivilegeMenu extends Model { }
  PrivilegeMenu.init({
    privilege_id: {
      
    },
    menu_id: {

    }
  }, {
    sequelize,
    modelName: 'PrivilegeMenu',
    tableName: 'privilege_menu',
    timestamps: true,
    comments: '权限与菜单关联表'
  })
}
