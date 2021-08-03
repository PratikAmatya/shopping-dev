const { Order, User, Item, OrderItem, sequelize } = require('../models');
const APIERROR = require('../utils/ErrorHandler');

exports.postOrder = async (req, res, next) => {
	try {
		const { userId, deliveryAddress, items } = req.body;

		if (!userId) throw new APIERROR('User Verification Failed');

		if (!deliveryAddress || !items) {
			throw new APIERROR('Missing Parameters', 400);
		}

		if (!Array.isArray(items))
			throw new APIERROR('Items has wrong data type', 400);

		if (items.length < 1) {
			throw new APIERROR('Empty Items list', 401);
		}

		items.forEach((item) => {
			if (!item.item_id || !item.quantity) {
				throw new APIERROR('Items have missing parameters', 400);
			}
		});

		const user_id = parseInt(userId);

		const user = await User.findByPk(user_id);

		if (!user) throw new APIERROR('User Not Found', 404);

		const approvedItems = new Array();

		let itemFound = true;
		let hasQuantityError = false;

		for (let item of items) {
			const foundItem = await Item.findOne({
				attributes: [
					['item_id', 'ItemId'],
					['unit_price', 'UnitPrice'],
					['stock', 'Stock'],
				],
				where: { item_id: item.item_id },
			});

			if (!foundItem) {
				itemFound = false;
				break;
			}

			if (parseInt(item.quantity) > parseInt(foundItem.dataValues.Stock)) {
				hasQuantityError = true;
				break;
			}

			const newItem = {
				item_id: item.item_id,
				quantity: parseInt(item.quantity),
				unit_price: parseFloat(foundItem.dataValues.UnitPrice),
			};

			approvedItems.push(newItem);
		}

		if (!itemFound) throw new APIERROR('Item does not exist', 401);

		if (hasQuantityError)
			throw new APIERROR(
				'The quantity exceeds the stock amount of the item',
				401
			);

		await sequelize.transaction(async (t) => {
			const order = await Order.create(
				{
					user_id: parseInt(user_id),
					delivery_address: deliveryAddress,
				},
				{ transaction: t }
			);

			const orderItems = [];

			approvedItems.forEach((item) => {
				orderItems.push({
					order_id: parseInt(order.dataValues.order_id),
					...item,
				});
			});

			const createdOrderItems = await OrderItem.bulkCreate(orderItems, {
				returning: true,
				transaction: t,
			});

			res.json({
				status: 'success',
				orderId: order.order_id,
				userId: order.user_id,
				order: createdOrderItems,
			});
		});
	} catch (err) {
		next(err);
	}
};

exports.getAllOrders = async (req, res, next) => {
	try {
		const { userId } = req.body;

		if (!userId) throw new APIERROR('User Verification Failed');

		const user_id = parseInt(userId);

		const user = await User.findByPk(user_id);

		if (!user) throw new APIERROR('User Not Found', 404);

		const foundOrders = await Order.findAll({
			where: {
				user_id,
			},
			attributes: ['order_id', 'delivery_address', 'delivered', 'updated_at'],
			include: [
				{
					model: User,
					required: true,
					attributes: ['user_name'],
				},
				{
					model: Item,
					required: true,
					as: 'order_item',
					attributes: {
						exclude: ['created_at', 'updated_at', 'stock'],
					},
				},
			],
		});

		res.json({ status: 'success', order: foundOrders });
	} catch (err) {
		next(err);
	}
};

exports.deleteOrder = async (req, res, next) => {
	try {
		const { userId } = req.body;

		const order_id = req.params.id;

		if (!userId) throw new APIERROR('User Verification Failed');

		const user_id = parseInt(userId);

		const user = await User.findByPk(user_id);

		if (!user) throw new APIERROR('User Not Found', 404);

		const orderFound = await Order.findOne({
			where: {
				order_id,
				user_id,
			},
		});

		if (!orderFound)
			throw new APIERROR(`Order with order id ${order_id} not found`, 404);

		const orderDeleted = await Order.destroy({
			where: { order_id, user_id },
			returning: true,
		});

		res.json(orderDeleted);
		// const foundOrder = await Order.findAll({
	} catch (err) {
		next(err);
	}
};

exports.getOrder = async (req, res, next) => {
	try {
		const { userId } = req.body;

		const order_id = req.params.id;

		if (!userId) throw new APIERROR('User Verification Failed');

		const user_id = parseInt(userId);

		const user = await User.findByPk(user_id);

		if (!user) throw new APIERROR('User Not Found', 404);

		const foundOrder = await Order.findOne({
			where: {
				user_id,
				order_id,
			},
			attributes: ['order_id', 'delivery_address', 'delivered', 'updated_at'],
			include: [
				{
					model: Item,
					required: true,
					as: 'order_item',
					attributes: {
						exclude: ['created_at', 'updated_at', 'stock'],
					},
				},
			],
		});

		if (!foundOrder)
			throw new APIERROR(`Order with order id ${order_id} not found`);

		res.json({ status: 'success', order: foundOrder });
	} catch (err) {
		next(err);
	}
};
