'use strict';

const bcrypt = require('bcrypt');

module.exports = {
	up: async (queryInterface, Sequelize) => {
		/**
		 * Add seed commands here.
		 *
		 * Example:
		 * await queryInterface.bulkInsert('People', [{
		 *   name: 'John Doe',
		 *   isBetaMember: false
		 * }], {});
		 */
		await queryInterface.bulkInsert(
			'user',
			[
				{
					user_name: 'Apple',
					password: bcrypt.hashSync('nepal11', bcrypt.genSaltSync(2)),
					user_role: 'admin',
					created_at: new Date(),
					updated_at: new Date(),
				},
				{
					user_name: 'Banana',
					user_role: 'customer',
					password: bcrypt.hashSync('nepal22', bcrypt.genSaltSync(2)),
					created_at: new Date(),
					updated_at: new Date(),
				},
				{
					user_name: 'Cat',
					user_role: 'customer',
					password: bcrypt.hashSync('nepal33', bcrypt.genSaltSync(2)),
					created_at: new Date(),
					updated_at: new Date(),
				},
			],
			{}
		);
	},

	down: async (queryInterface, Sequelize) => {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
		await queryInterface.bulkDelete('user', null, {});
	},
};
