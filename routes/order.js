const router = require('express').Router();
const orderController = require('../controllers/order.controller');

router.get('/', orderController.getAllOrders);

router.get('/:id', orderController.getOrder);

// router.put('/:id', orderController.putOrder);

router.post('/', orderController.postOrder);

router.delete('/:id', orderController.deleteOrder);

module.exports = router;
