	/**
		* Created by Thomas on 27/11/2016.
		* Project : server
		*/
	const userModel = require('../models/user');
const sha512 = require('sha512');
const config = require('../config/configuration');
const jwt = require('jsonwebtoken');

module.exports = {
	signIn(req, res, next) {
		var password = sha512(config.salt.before + req.body.password + config.salt.after).toString('hex');
		userModel.signIn(req.body.name, password, function(err, result) {
			try {
				if (err) {
					throw new Error(err.message);
				}

				if (!result) {
					res.status(404).send({message: 'NOT_FOUND'});
					return;
				}

				let token = jwt.sign(result, config.jwt.secret, config.session);

				res.send({token: token});
			} catch (exception) {
				console.error(exception);
				res.status(500).send(exception);
			}
		});
	},

	signUp(req, res, next) {
		var user = req.body;
		if (user.password) user.password = sha512(config.salt.before + req.body.password + config.salt.after)
			.toString('hex');
		userModel.add(user)
			.then((result) => {
				res.status(200).send(result);
			})
			.catch(err => {
				res.status(400).send(err);
			});
	},
};
