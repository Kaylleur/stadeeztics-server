	/**
		* Created by Thomas on 27/11/2016.
		* Project : server
		*/
const userModel = require('../models/user');
const sha512 = require('sha512');
const config = require('../config/configuration');
const jwt = require('jsonwebtoken');
const Response = require('../utils/response')

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
						res.status(404).send(new Response(404,"User Not found"));
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
		let user = req.body;

		if(user.password !== user.password2) {
            res.status(400).send(new Response(400,"Password are not same"));
            return;
        }
        delete user.password2;

		if (user.password) user.password = sha512(config.salt.before + req.body.password + config.salt.after)
			.toString('hex');

		userModel.checkEmailUnique(user.mail)
			.then(users => {
				if(users.length > 0){
					res.status(400).send(new Response(400,"Email not unique"));
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
		res.status(200).send(new Response(200,"Token valid"));
	}
};
