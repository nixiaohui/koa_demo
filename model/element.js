const Model = require('sequelize').Model

module.exports = (sequelize, DataTypes) => {
  class Element extends Model { }
  Element.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Element',
    tableName: 'elements',
    comment: '页面元素控件表',
    timestamps: true
  })
  Element.associate = function(models) {
    models.Element.belongsTo(models.Privilege)
  }

  return Element
}
