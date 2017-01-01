/**
 * Created by Thomas on 24/12/2016.
 */
var deezerAccountSchema = require('../schemas/deezerAccount');
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;

var DeezerAccount = mongoose.model('DeezerAccount',deezerAccountSchema);

module.exports = {
    get: function(id){
        return DeezerAccount.findById(id);
            // .then(user => callback(null,user));
    },
    getByMultipleIds : function(ids){
        var objectId = [];
        for (let id of ids) {
            objectId.push(new ObjectId(id));
        }
        return DeezerAccount.find({_id:{$in:objectId}});
    },
    getByDeezerId : function(id){
        return DeezerAccount.findOne({id:id}).exec();
    },
    add: function(deezerAccount){
        var newAccount = new DeezerAccount(deezerAccount);
        return newAccount.save(); //should check that with Paul <3
        // .then(callback(null,newUser))
        // .catch(err => callback(err,user));
    },
    edit: function(id, body, callback){
        DeezerAccount.findOneAndUpdate({_id: new ObjectId(id)},{ $set : body },{},callback);
    },
};