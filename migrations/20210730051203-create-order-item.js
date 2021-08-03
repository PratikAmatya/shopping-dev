'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('order_item', {
			order_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				onDelete: 'CASCADE',
				references: {
					model: 'order',
					key: 'order_id',
				},
			},
			item_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				references: {
					model: 'item',
					key: 'item_id',
				},
			},
			quantity: {
				allowNull: false,
				type: Sequelize.INTEGER,
			},
			unit_price: {
				allowNull: false,
				type: Sequelize.DECIMAL,
			},
			created_at: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updated_at: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('order_item');
	},
};
