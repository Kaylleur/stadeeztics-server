/**
 * Created by Thomas on 24/11/2016.
 * Project : server
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const emailValidator = require("email-validator");

const userSchema = Schema({
	name: {type: String, index: true, required: [true, "Name is missing"]},
	password: {type: String,required: [true, "Password is missing"]},
	gravatar: {type: String, required : true},
	mail: {
		type: String,
		validate: {
			validator: function(v) {
				return emailValidator.validate(v);
			},
			message: '{VALUE} is not a valid email'
		},
		required: [true, "Mail is missing"]},
	deezerAccounts: [Schema.Types.ObjectId]
}, {
	versionKey: false
});


module.exports = userSchema;