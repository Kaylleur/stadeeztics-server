/**
 * Listen on /user
 * Created by Thomas on 23/11/2016.
 */
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

/* GET home page. */
router.get('/deezer', userController.addDeezerAccount);
router.get('/', userController.getCurrentUser);
router.get('/:_id', userController.getUser);

module.exports = router;