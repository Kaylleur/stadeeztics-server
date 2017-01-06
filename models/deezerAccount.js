/**
 * Created by Thomas on 24/12/2016.
 * Project : server
 */
const deezerAccountSchema = require('../schemas/deezerAccount');
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

const DeezerAccount = mongoose.model('DeezerAccount', deezerAccountSchema);

module.exports = {
	get(id) {
		return DeezerAccount.findById(id);
	},

	getByMultipleIds(ids) {
		let objectId = [];
		for (let id of ids) {
			objectId.push(new ObjectId(id));
		}

		return DeezerAccount.find({_id: {$in: objectId}});
	},

	getByDeezerId(id) {
		return DeezerAccount.findOne({id: id}).exec();
	},

	add(deezerAccount) {
		let newAccount = new DeezerAccount(deezerAccount);
		return newAccount.save();
	},

	edit(id, body, callback) {
		DeezerAccount.findOneAndUpdate({_id: new ObjectId(id)}, {$set: body}, {}, callback);
	},
};
