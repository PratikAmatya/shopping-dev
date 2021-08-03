'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Item extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Item.belongsToMany(models.Order, {
				through: models.OrderItem,
				foreignKey: 'item_id',
				as: 'order_item',
			});
		}
	}

	Item.init(
		{
			item_id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				allowNull: false,
				autoIncrement: true,
			},
			item_name: DataTypes.STRING,
			unit_price: DataTypes.DECIMAL,
			stock: DataTypes.BIGINT,
		},
		{
			sequelize,
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'item',
			modelName: 'Item',
		}
	);
	return Item;
};
