const chai = require('chai');
const expect = chai.expect;
const server = require('../app');
const assertArrays = require('chai-arrays');
const request = require('supertest')('127.0.0.1:3000');

chai.use(assertArrays);

describe('testing of shopping sequelize api', () => {
	it('should return all the items', (done) => {
		request
			.get('/item')
			.then((response) => {
				expect(response.status).to.eq(200);
				expect(response.body.Items.length).to.be.greaterThanOrEqual(0);
				done();
			})
			.catch((err) => done(err));
	});

	it('should post item', (done) => {
		request
			.post('/item')
			.send({
				userId: 1,
				items: [
					{
						item_name: 'Mi 1',
						unit_price: 10000,
						stock: 3,
					},
					{
						item_name: 'Mi 2',
						unit_price: 20000,
						stock: 4,
					},
					{
						item_name: 'Mi 3',
						unit_price: 30000,
						stock: 5,
					},
				],
			})
			.then((response) => {
				expect(response.status).to.eql(201);
				done();
			})
			.catch((err) => done(err));
	});

	it('should not allow unauthorized user to post item', (done) => {
		request
			.post('/item')
			.send({
				userId: 2,
				items: [
					{
						item_name: 'Mi 1',
						unit_price: 10000,
						stock: 3,
					},
					{
						item_name: 'Mi 2',
						unit_price: 20000,
						stock: 4,
					},
					{
						item_name: 'Mi 3',
						unit_price: 30000,
						stock: 5,
					},
				],
			})
			.then((response) => {
				expect(response.status).to.eql(401);
				done();
			})
			.catch((err) => done(err));
	});

	it('should return all the orders belonging to the user', (done) => {
		request
			.get('/order')
			.send({ userId: 2 })
			.then((response) => {
				expect(response.status).to.be.eq(200);
				expect(response.body.order).to.be.array();
				done();
			})
			.catch((err) => {
				done(err);
			});
	});

	it('should return 404', (done) => {
		request
			.get('/random')
			.then((response) => {
				expect(response.status).to.be.eq(404);
				expect(response.body).to.be.eql('Error 404: Invalid Endpoint');
				done();
			})
			.catch((err) => {
				done(err);
			});
	});
});
