const { User, Item, sequelize } = require('../models');
const APIERROR = require('../utils/ErrorHandler');
const redis = require('redis');

// Configuring Redis
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const redisClient = redis.createClient(REDIS_PORT);
const DEFAULT_EXPIRATION = 100;

const getOrSetCache = async (key, cb) => {
	return new Promise((resolve, reject) => {
		redisClient.get(key, async (error, data) => {
			if (error) return reject(error);
			if (data != null) return resolve(JSON.parse(data));
			const freshData = await cb();
			redisClient.setex(key, DEFAULT_EXPIRATION, JSON.stringify(freshData));
			resolve(freshData);
		});
	});
};

exports.postItem = async (req, res, next) => {
	try {
		const { userId, items } = req.body;

		if (!userId) throw new APIERROR('User Verification Failed', 401);

		const user = await User.findByPk(parseInt(userId));

		if (!user) throw new APIERROR('User Not Found', 404);

		if (user.user_role !== 'admin')
			throw new APIERROR('User Not Authorized', 401);

		if (!items) throw new APIERROR('Missing Parameters');

		if (!Array.isArray(items)) throw new APIERROR('Wrong Parameter', 406);

		if (items.length === 0) throw new APIERROR('No items to post', 411);

		items.forEach((item) => {
			if (!item.item_name || !item.unit_price || !item.stock)
				throw new APIERROR('Invalid Items Parameters', 400);
			item.stock = parseInt(item.stock);
			item.unit_price = parseFloat(item.unit_price);
		});

		await sequelize.transaction(async (t) => {
			const createdItems = await Item.bulkCreate(items, {
				returning: true,
				transaction: t,
			});

			res.json({ status: 'success', createdItems });
		});
	} catch (err) {
		next(err);
	}
};

exports.getAllItems = async (req, res, next) => {
	try {
		const storedItems = await getOrSetCache('items', async () => {
			const Items = await Item.findAll({
				attributes: [
					['item_id', 'ItemId'],
					['item_name', 'ItemName'],
					['unit_price', 'UnitPrice'],
					['stock', 'Stock'],
				],
			});

			return Items;
		});

		if (!storedItems) throw new APIERROR('Something Went Wrong', 500);
		res.status(200).json({
			status: 'success',
			TotalItems: storedItems.length,
			Items: storedItems,
		});
	} catch (err) {
		next(err);
	}
};

exports.getItem = async (req, res, next) => {
	try {
		const item_id = req.params.id;

		const storedItem = await getOrSetCache(`item:${item_id}`, async () => {
			const itemFound = await Item.findOne({
				attributes: [
					['item_id', 'ItemId'],
					['item_name', 'ItemName'],
					['unit_price', 'UnitPrice'],
					['stock', 'Stock'],
				],
				where: {
					item_id: parseInt(item_id),
				},
			});

			return itemFound;
		});

		if (!storedItem)
			throw new APIERROR(`Item with the item id ${item_id} not found`, 404);

		res.status(200).json({ status: 'success', item: storedItem });
	} catch (err) {
		next(err);
	}
};

exports.putItem = async (req, res, next) => {
	try {
		const user_id = req.body.userId;
		const { item } = req.body;
		const item_id = req.params.id;

		if (!user_id) throw new APIERROR('User Verification Failed');

		if (!item) throw new APIERROR('Missing Parameters');

		const user = await User.findByPk(parseInt(user_id));

		if (!user) throw new APIERROR('User Not Found', 404);

		if (user.user_role !== 'admin')
			throw new APIERROR('User not authorized', 401);

		if (!item.item_name || !item.unit_price || !item.stock)
			throw new APIERROR('Invalid Items Parameters', 400);

		const itemFound = await Item.findByPk(item_id);

		if (!itemFound) throw new APIERROR('Item does not exist');

		const updatedItem = await Item.update(
			{
				item_name: item.item_name,
				unit_price: parseFloat(item.unit_price),
				stock: parseInt(item.stock),
			},
			{
				where: {
					item_id,
				},
				returning: true,
			}
		);

		if (updatedItem[0] === 0) {
			throw new APIERROR(`Item with item id ${Item_id} could not updated`, 400);
		}

		if (updatedItem[0] >= 1) {
			redisClient.flushall(async (err, reply) => {
				if (err) throw new APIERROR('Redis Cache Clearly failed');
			});
			res
				.status(200)
				.json({ status: 'Success', updatedItem: updatedItem[1][0] });
		}
	} catch (err) {
		next(err);
	}
};

exports.deleteItem = async (req, res, next) => {
	try {
		const user_id = req.body.userId;
		const Item_id = req.params.id;

		if (!user_id) throw new APIERROR('User Verification Failed', 401);

		if (!Item_id) throw new APIERROR('Missing Parameters', 400);

		const user = await User.findByPk(parseInt(user_id));

		if (!user) throw new APIERROR('User Not Found', 404);

		if (user.user_role !== 'admin')
			throw new APIERROR('User Not Authorized', 401);

		const item = await Item.findByPk(Item_id);

		if (!item)
			throw new APIERROR(`Item with item id ${Item_id} not found`, 404);

		const deleteItemstatus = await Item.destroy({
			where: {
				item_id: Item_id,
			},
		});

		if (deleteItemstatus === 1) {
			redisClient.flushall(async (err, reply) => {
				if (err) throw new APIERROR('Redis Cache Clearly failed');
			});
			res
				.status(200)
				.json({ status: 'success', message: 'Item has been deleted' });
		}
	} catch (err) {
		next(err);
	}
};
