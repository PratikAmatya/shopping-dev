'use strict';
const bcrypt = require('bcrypt');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			User.hasMany(models.Order);
		}
	}
	User.init(
		{
			user_id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				allowNull: false,
				autoIncrement: true,
			},
			user_name: {
				type: DataTypes.STRING,
				unique: true,
			},
			user_role: {
				type: DataTypes.ENUM,
				values: ['admin', 'customer'],
				allowNull: true,
				defaultValue: 'customer',
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			tableName: 'user',
			modelName: 'User',
			hooks: {
				beforeCreate: async (u) => {
					console.log(u);
					console.log(u.password);
					const salt = await bcrypt.genSalt(8);
					u.password = await bcrypt.hash(u.password, salt);
					// u.setDataValue('password', 'kathmandu');
				},
			},
		}
	);

	User.prototype.validPassword = async function _(password) {
		return bcrypt.compare(password, this.password);
	};
	return User;
};
