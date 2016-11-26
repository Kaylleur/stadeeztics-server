/**
 * Created by Thomas on 24/11/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
    name: String,
    password : String,
    mail: String,
    deezerAccounts : [Schema.Types.ObjectId]
});


module.exports = userSchema;