const router = require('express').Router();
const itemController = require('../controllers/item.controller');

router.get('/', itemController.getAllItems);

router.get('/:id', itemController.getItem);

router.put('/:id', itemController.putItem);

router.post('/', itemController.postItem);

router.delete('/:id', itemController.deleteItem);

module.exports = router;
