/**
 * Created by Thomas on 24/11/2016.
 * Project : server
 */
const userSchema = require('../schemas/user');
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

const User = mongoose.model('User', userSchema);

module.exports = {
	get(id) {
		return User.findOne({_id: new ObjectId(id)}, {password: 0});
	},

	signIn(name, password, callback) {
		User.findOne({name: name, password: password}, {name: 1})
			.then(user => callback(null, user));
	},

	add(user) {
		let newUser = new User(user);
		return newUser.save();
	},

	edit(id, body, callback) {
		User.findOneAndUpdate({_id: new ObjectId(id)}, {$set: body}, {}, callback);
	},

	addDeezerAccount(user, deezerAccount) {
		console.log(deezerAccount);
		console.log(new ObjectId(deezerAccount._id));
		return User.findOneAndUpdate({_id: new ObjectId(user._id)}, {$push: {deezerAccounts: new ObjectId(deezerAccount._id)}}, {});
	},

};
