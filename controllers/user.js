/**
 * Created by Thomas on 24/11/2016.
 */
var userModel = require('../models/user');
var deezerAccountModel = require('../models/deezerAccount');
var bluebird = require('bluebird'); // Promises
var DZ = require('node-deezer');
var deezer = new DZ();
var config = require('../config/configuration')
var sha512 = require('sha512');

bluebird.promisifyAll(deezer);

module.exports = {
    addDeezerAccount : function(req,res,next){
        var token,deezerAccountFromApi;
        deezer.createSessionAsync(config.app.id,config.app.secret,req.query.code) //get token
            .then(result => { //get info about deezer account
                token = result.accessToken;
                return deezer.requestAsync(token, {
                    resource: 'user/me',
                    method: 'get'
                })
            })
            .then(deezerUser => { //check if account already exist in our db
                deezerAccountFromApi = deezerUser;
                return deezerAccountModel.getByDeezerId(deezerUser.id)
            })
            .then(deezerAccountFromDb => { //save deezer account to db
                if(!deezerAccountFromDb) {
                    console.log("save it");
                    deezerAccountFromApi.accessToken = token;
                    return deezerAccountModel.add(deezerAccountFromApi);
                }
                deezerAccountFromApi = deezerAccountFromDb;
            })
            .then(() => { //load user from db
                return userModel.get(req.user._id);
            })
            .then(user =>{ //add deezer account it to user
                if(user.deezerAccounts.indexOf(deezerAccountFromApi._id) === -1)
                    return userModel.addDeezerAccount(user, deezerAccountFromApi);

                return Promise.resolve({
                    then : function(resolve) {
                        resolve(user); }
                });
            })
            .then((user) => { //finished
                // req.user.deezerAccounts.push(deezerAccountFromApi._id);
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
                return deezerAccountModel.getByMultipleIds(_user.deezerAccounts);
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