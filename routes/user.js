var express = require('express');
var router = express.Router();
const userRoutes = require('../controllers/user.controller');

/* GET home page. */
router.get('/', userRoutes.getAllUsers);
router.post('/', userRoutes.postUser);

module.exports = router;
