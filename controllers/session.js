	/**
		* Created by Thomas on 27/11/2016.
		* Project : server
		*/
	const userModel = require('../models/user');
const sha512 = require('sha512');
const config = require('../config/configuration');
const jwt = require('jsonwebtoken');

module.exports = {
	/**
	 *
	 * @param req Needs mail and password
	 * @param res the response
	 */
	signIn(req, res) {
		var password = sha512(config.salt.before + req.body.password + config.salt.after).toString('hex');
		userModel.signIn(req.body.mail, password)
			.then(result => {
				try {
					if (!result) {
						res.status(404).send({message: 'NOT FOUND'});
						return;
					}

					let token = jwt.sign(result, config.jwt.secret, config.session);

					res.send({token: token, user:result});
				} catch (exception) {
					console.error(exception);
					res.status(500).send(exception);
				}
			})
			.catch(err => {
				throw new Error(err.message);
		});
	},

	signUp(req, res) {
		var user = req.body;
		if (user.password) user.password = sha512(config.salt.before + req.body.password + config.salt.after)
			.toString('hex');
		userModel.checkEmailUnique(user.mail)
			.then(users => {
				if(users.length > 0){
					res.status(400).send({code: 400 ,message : 'MAIL ALREADY REGISTERED'});
					return;
				}
				return userModel.add(user);
			})
			.then((result) => {
				res.status(200).send(result);
			})
			.catch(err => {
				res.status(400).send(err);
			});
	},

	checkToken(req,res){
		res.status(200).send({code : 200, message : 'TOKEN VALID'});
	}
};
