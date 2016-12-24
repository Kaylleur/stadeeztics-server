/**
 * Created by Thomas on 24/11/2016.
 */
var mongoose = require('mongoose');
var userModel = require('../models/user');
var deezerAccountModel = require('../models/deezerAccount');
var bluebird = require('bluebird'); // Promises
var DZ = require('node-deezer');
var deezer = new DZ();
var config = require('../config/configuration')
var sha512 = require('sha512');

bluebird.promisifyAll(deezer);

module.exports = {
    addDeezerAccount : function(req,res,next){ //@TODO should simplify that =(
        deezer.createSessionAsync(config.app.id,config.app.secret,req.query.code) //get token
            .then(function (result) {
                return deezer.requestAsync(result.accessToken,{ //get info about deezer account
                    resource:'user/me',
                    method:'get'
                }).then(function (deezerUser) { //save deezer account to db
                    deezerAccountModel.add(deezerUser,function(err,result){
                        if(err) res.status(400).send(err);

                        userModel.addDeezerAccount(req.user._id,result._id) //add the _id to the user
                            .then(user => {
                                user.deezerAccounts.push(result._id);
                                res.status(200).send(user)
                            })
                            .catch(err => res.status(400).send(err));
                    });
                });
            })
            .catch(function (err) {
                console.log(err)
                res.status(500).send(err);
            });
    },

    getAllUsers : function(req,res,next){
        res.status(200).send(req.decoded);
    }
};