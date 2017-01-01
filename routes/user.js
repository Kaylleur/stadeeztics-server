/**
 * Listen on /user
 * Created by Thomas on 23/11/2016.
 */
var express = require('express');
var router = express.Router();
var userController = require('../controllers/user');

/* GET home page. */
router.get('/deezer', userController.addDeezerAccount);
router.get('/', userController.getCurrentUser);

module.exports = router;