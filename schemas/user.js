/**
 * Created by Thomas on 24/11/2016.
 */
var mongoose = require('mongoose');


var userSchema = mongoose.Schema({
    name: String,
    password : String,
    mail: String,
    token : String
});