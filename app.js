const express = require('express');
const logger = require('morgan');
const dotenv = require('dotenv');

const app = express();

dotenv.config({ path: '.env' });

const orderRoutes = require('./routes/order');
const userRoutes = require('./routes/user');
const itemRoutes = require('./routes/item');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/user', userRoutes);

app.use('/order', orderRoutes);

app.use('/item', itemRoutes);

app.use(function (req, res, next) {
	res.status(404).json('Error 404: Invalid Endpoint');
});

app.use((err, req, res, next) => {
	res
		.status(err.statusCode || 500)
		.json({ message: err.message || 'Something Went Wrong' });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, (err) => {
	if (err) console.log('Error occured');
	console.log(`App is listening at http://localhost:${PORT}`);
});
