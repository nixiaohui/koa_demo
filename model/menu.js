const Model = require('sequelize').Model
module.exports = (sequelize, DataTypes) => {
  class Menu extends Model { }
  Menu.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    url: {
      type: DataTypes.STRING
    },
    icon: {
      type: DataTypes.STRING
    },
    sort_id: {
      type: DataTypes.INTEGER
    },
    parent_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Menu,
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Menu',
    tableName: 'menus',
    timestamps: true,
    comment: '菜单表'
  })
  Menu.associate = function(models) {
    models.Menu.belongsTo(models.Privilege)
  }

  return Menu
}
