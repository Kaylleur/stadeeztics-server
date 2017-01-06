/**
 * Created by Thomas on 04/01/2017.
 * Project : server
 */
const express = require('express');
const router = express.Router();
const userModel = require('../models/user');
const Response = require('../utils/response');

// route middleware to verify deezerAccount
router.use('/deezer/:deezerId', function(req, res, next) {
	userModel.get(req.user._id)
		.then(user => {
			req.userLoaded = user;
			if (!req.params.deezerId) throw new Response(400, 'BAD_REQUEST_MISSING_DEEZER_ID');
			if (user.deezerAccounts.indexOf(req.params.deezerId) === -1) throw new Response(403, 'ACCOUNT_NOT_BELONGING_TO_THIS_USER');
		})
		.then(() => {
			next();
		})
		.catch(err => {
			if (!err.code) err.code = 500;
			console.error(err);
			res.status(err.code).send(err);
		});
});

module.exports = router;
