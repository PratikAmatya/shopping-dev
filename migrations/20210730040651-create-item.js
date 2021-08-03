'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('item', {
			item_id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			item_name: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			unit_price: {
				allowNull: false,
				type: Sequelize.DECIMAL,
			},
			stock: {
				type: Sequelize.BIGINT,
				allowNull: false,
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
		await queryInterface.dropTable('item');
	},
};
