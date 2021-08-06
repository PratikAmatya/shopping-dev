'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class OrderItem extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			OrderItem.belongsTo(models.Order, {
				foreignKey: 'order_id',
				onDelete: 'CASCADE',
			});
			OrderItem.belongsTo(models.Item, { foreignKey: 'item_id' });
		}
	}
	OrderItem.init(
		{
			quantity: DataTypes.INTEGER,
			unit_price: DataTypes.DECIMAL,
		},
		{
			sequelize,
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'order_item',
			modelName: 'OrderItem',
		}
	);
	return OrderItem;
};
