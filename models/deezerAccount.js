/**
 * Created by Thomas on 24/12/2016.
 */
require('../mongo/database').connect();
var deezerAccountSchema = require('../schemas/deezerAccount');
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;

var DeezerAccount = mongoose.model('DeezerAccount',deezerAccountSchema);

module.exports = {
    get: function(id,callback){
        DeezerAccount.findById(id)
            .then(user => callback(null,user));
    },
    add: function(deezerAccount,callback){
        var newAccount = new DeezerAccount(deezerAccount);
        newAccount.save(err => callback(err,newAccount)); //should check that with Paul <3
        // .then(callback(null,newUser))
        // .catch(err => callback(err,user));
    },
    edit: function(id, body, callback){
        DeezerAccount.findOneAndUpdate({_id: new ObjectId(id)},{ $set : body },{},callback);
    },
};