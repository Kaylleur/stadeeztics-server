/**
 * Created by Thomas on 24/11/2016.
 * Project : server
 */
const userSchema = require('../schemas/user');
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

const User = mongoose.model('User', userSchema);
const Response = require('../utils/response');
const md5 = require('md5');
const ObjectIdTester = require('../utils/objectIdTester');

module.exports = {
	/**
	 * @param id : ObjectId
	 * @param includePassword : boolean
	 * @returns {Query|*|Promise}
	 */
	get(id,includePassword) {
		let password = {password: 0};
		if(includePassword) password = {};

		if (!ObjectIdTester.isValid(id)) {
			console.warn("BAD OBJECT ID INTO QUERY " + id);
			throw new Response(404, 'NOT FOUND');
		}

		let _id = ObjectId(id);
		return User.findOne({_id: _id}, password );
	},

	signIn(mail, password) {
		return User.findOne({mail: mail, password: password}, {name: 1,gravatar:1});
	},

	add(user) {
        user.gravatar = this.getGravatar(user);
        let newUser = new User(user);
		return newUser.save();
	},

	edit(id, body) {
		return User.findOneAndUpdate({_id: new ObjectId(id)}, {$set: body}, {});
	},

	addDeezerAccount(user, deezerAccount) {
		return User.findOneAndUpdate({_id: new ObjectId(user._id)}, {$push: {deezerAccounts: new ObjectId(deezerAccount._id)}}, {});
	},

	checkEmailUnique(mail){
		return User.find({mail:mail});
	},

	getGravatar(user){
		let hash = md5(user.mail.trim().toLowerCase());
		return "https://www.gravatar.com/avatar/" + hash;
	}

};
