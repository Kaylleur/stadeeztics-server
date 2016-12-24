/**
 * Listen on /session
 * Created by Thomas on 27/11/2016.
 */
var express = require('express');
var router = express.Router();
var sessionController = require('../controllers/session');

/* GET home page. */
router.post('/signIn',sessionController.signIn);
router.post('/',sessionController.signUp);

module.exports = router;