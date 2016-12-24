/**
 * Created by Thomas on 24/11/2016.
 */
var mongoose = require('mongoose');
var userModel = require('../models/user');
var bluebird = require('bluebird'); // Promises
var DZ = require('node-deezer');
var deezer = new DZ();
var config = require('../config/configuration')
var sha512 = require('sha512');

bluebird.promisifyAll(deezer);

module.exports = {
    addDeezerAccount : function(req,res,next){

        deezer.createSessionAsync(config.app.id,config.app.secret,req.params.code)
            .then(function (result) {
                return deezer.requestAsync(result.accessToken,{
                    resource:'user/me',
                    method:'get'
                }).then(function (user) {
                    //add this deezer account to user
                    res.status(200).send(user);
                })
            })
            .catch(function (err) {
                console.log(err)
                res.send(500, err);
            });
    },
    signUp : function(req,res,next){
        var user = req.body;
        if(user.password)user.password = sha512(config.salt.before + req.body.password + config.salt.after).toString('hex');
        userModel.add(user,function(err,result){
            console.log("callback called");
            if(err){
                console.log('i send error');
                res.status(400).send(err);
                return;
            }
            console.log('trying to be here');

            res.status(200).send(result);
        });
    }
};