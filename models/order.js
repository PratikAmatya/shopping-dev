'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Order extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Order.belongsTo(models.User, {
				foreignKey: 'user_id',
				onDelete: 'cascade',
			});
			Order.belongsToMany(models.Item, {
				through: models.OrderItem,
				foreignKey: 'order_id',
				
			});
		}
	}
	Order.init(
		{
			order_id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				allowNull: false,
				autoIncrement: true,
			},
			delivery_address: DataTypes.STRING,
			delivered: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
				allowNull: true,
			},
		},
		{
			sequelize,
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'order',
			modelName: 'Order',
		}
	);
	return Order;
};
