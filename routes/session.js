/**
 * Listen on /session
 * Created by Thomas on 27/11/2016.
 */
var express = require('express');
var router = express.Router();
var sessionController = require('../controllers/session');

/* GET home page. */
router.post('/',sessionController.signIn);

module.exports = router;