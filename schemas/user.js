/**
 * Created by Thomas on 24/11/2016.
 * Project : server
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema({
	name: {type: String, index: true, required: [true, "Name is missing"]},
	password: {type: String, required: [true, "Password is missing"]},
	mail: {type: String, required: [true, "Mail is missing"]},
	deezerAccounts: [Schema.Types.ObjectId]
}, {
	versionKey: false
});


module.exports = userSchema;