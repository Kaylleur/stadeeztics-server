/**
 * Listen on /session
 * Created by Thomas on 27/11/2016.
 */
const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/session');

/* GET home page. */
router.post('/signIn', sessionController.signIn);
router.post('/', sessionController.signUp);

module.exports = router;