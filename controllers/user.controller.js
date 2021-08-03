const APIERROR = require('../utils/ErrorHandler');
const { User } = require('../models');

exports.getAllUsers = async (req, res, next) => {
	try {
		const { userId } = req.body;

		const user = await User.findByPk(userId);

		if (!user) throw new APIERROR('User does not exist', 404);

		if (user.user_role !== 'admin')
			throw new APIERROR('User not authorized', 401);

		const users = await User.findAll({
			attributes: ['user_id', 'user_name', 'user_role'],
		});

		const totalUsers = await User.count({ distinct: 'user_name' });

		return res.status(200).json({ status: 'success', totalUsers, users });
	} catch (err) {
		next(err);
	}
};

exports.postUser = async (req, res, next) => {
	try {
		const { userId, userName, userPassword, userRole } = req.body;

		if (!userId) throw new APIERROR('User Verification Failed', 401);

		if (!userName || !userPassword || !userRole)
			throw new APIERROR('Missing Parameters', 400);

		const user = await User.findByPk(parseInt(userId));

		if (!user) throw new APIERROR('User Not Found', 404);

		if (user.user_role !== 'admin')
			throw new APIERROR('User Not Authorized', 401);

		const userCreated = await User.create({
			user_name: userName,
			password: userPassword,
			user_role: userRole,
		});

		res.json({
			status: 'success',
			user: { userID: userCreated.user_id, userName: userCreated.user_name },
		});
	} catch (err) {
		next(err);
	}
};
