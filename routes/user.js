/**
 * Created by Thomas on 23/11/2016.
 */
var express = require('express');
var router = express.Router();
var userController = require('../controllers/user');

/* GET home page. */
router.get('/getAccess/:token', userController.signIn);

module.exports = router;