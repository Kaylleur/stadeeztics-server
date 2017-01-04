/**
 * Created by Thomas on 24/11/2016.
 */
var userModel = require('../models/user');
var deezerModel = require('../models/deezerAccount');
var bluebird = require('bluebird'); // Promises
var DZ = require('node-deezer');
var deezerApi = new DZ();
var config = require('../config/configuration')
var sha512 = require('sha512');

bluebird.promisifyAll(deezerApi);

module.exports = {
    addDeezerAccount : function(req,res,next){
        var token,deezerAccountFromApi;
        deezerApi.createSessionAsync(config.app.id,config.app.secret,req.query.code) //get token
            .then(result => { //get info about deezerApi account
                token = result.accessToken;
                return deezerApi.requestAsync(token, {
                    resource: 'user/me',
                    method: 'get'
                })
            })
            .then(deezerUser => { //check if account already exist in our db
                deezerAccountFromApi = deezerUser;
                return deezerModel.getByDeezerId(deezerUser.id)
            })
            .then(deezerAccountFromDb => { //save deezerApi account to db
                if(!deezerAccountFromDb) {
                    console.log("save it");
                    deezerAccountFromApi.accessToken = token;
                    return deezerModel.add(deezerAccountFromApi);
                }
                return Promise.resolve({
                    then : function(resolve) {
                        resolve(deezerAccountFromDb); }
                });
            })
            .then((deezerAccount) => { //load user from db
                deezerAccountFromApi = deezerAccount;
                return userModel.get(req.user._id);
            })
            .then(user =>{ //add deezerApi account it to user
                if(user.deezerAccounts.indexOf(deezerAccountFromApi._id) === -1)
                    return userModel.addDeezerAccount(user, deezerAccountFromApi);

                return Promise.resolve({
                    then : function(resolve) {
                        resolve(user); }
                });
            })
            .then((user) => { //finished
                user.deezerAccounts.push(deezerAccountFromApi._id);
                res.status(200).send(user);
            })
            .catch(function (err) {
                if(!err.code) err.code = 500;
                console.error(err);
                res.status(err.code).send(err);
            });
    },

    getCurrentUser : function(req,res,next){
        var user;
        userModel.get(req.user._id)
            .then(_user => {
                user = _user.toObject();//o_O
                return deezerModel.getByMultipleIds(_user.deezerAccounts);
            }).then(deezerAccounts => {
                user.deezerAccounts = deezerAccounts;
                res.status(200).send(user);
            })
            .catch(err =>{
                console.error(err);
                res.status(err.code).send(err);
        });
    }
};