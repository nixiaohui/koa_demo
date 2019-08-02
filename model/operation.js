const Model = require('sequelize').Model

module.exports = (sequelize, DataTypes) => {
  class Operation extends Model { }
  Operation.init({
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
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.STRING
    },
    parent_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Operation,
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Operation',
    tableName: 'operations',
    comment: '操作功能表',
    timestamps: true
  })
  Operation.associate = function(models) {
    models.Operation.belongsTo(models.Privilege)
  }

  return Operation
}
