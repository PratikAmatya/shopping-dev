const dotenv = require('dotenv');
dotenv.config();

const { DB_USERNAME, DB_PASSWORD, DB_HOST } = process.env;

module.exports = {
	development: {
		username: DB_USERNAME,
		password: DB_PASSWORD,
		database: 'shopping_dev',
		host: DB_HOST,
		dialect: 'postgres',
		logging: true,
	},
	test: {
		username: DB_USERNAME,
		password: DB_PASSWORD,
		database: 'shopping_test',
		host: DB_HOST,
		dialect: 'postgres',
	},
	production: {
		username: DB_USERNAME,
		password: DB_PASSWORD,
		database: 'shopping_prod',
		host: DB_HOST,
		dialect: 'postgres',
	},
};
