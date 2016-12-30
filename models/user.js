/**
 * Created by Thomas on 24/11/2016.
 */
var userSchema = require('../schemas/user');
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;

var User = mongoose.model('User',userSchema);

module.exports = {
    get: function(id){
        return User.findById(id);
            // .then(user => callback(null,user));
    },
    signIn: function(name,password,callback){
        User.findOne({name:name,password:password},{name:1})
            .then( user => callback(null,user));
    },
    add: function(user,callback){
        var newUser = new User(user);
        newUser.save(err => callback(err,user)); //should check that with Paul <3
            // .then(callback(null,newUser))
            // .catch(err => callback(err,user));
    },
    edit: function(id, body, callback){
        User.findOneAndUpdate({_id: new ObjectId(id)},{ $set : body },{},callback);
    },
    addDeezerAccount : function(user,deezerAccount){
        return User.findOneAndUpdate({_id: new ObjectId(user._id)},{$push:{deezerAccounts:deezerAccount._id}},{});
    }

};