/**
 * Created by Thomas on 24/11/2016.
 */
var userSchema = require('../schemas/user');
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;

var User = mongoose.model('users',userSchema);

module.exports = {
    get: function(id,callback){
        User.findById(id)
            .then(user => callback(null,user));
    },
    signIn: function(name,password,callback){
        User.find({name:name,password:password})
            .then( user => callback(null,user));
    },
    add: function(user,callback){
        var newUser = new User(user);
        newUser.save(err => callback(err,user));
    },
    edit: function(id, body, callback){
        User.findOneAndUpdate({_id: new ObjectId(id)},{ $set : body },callback);
    }

};