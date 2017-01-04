/**
 * Created by Thomas on 02/01/2017.
 */
var bluebird = require('bluebird'); // Promises
var userModel = require('../models/user');
var deezerModel = require('../models/deezerAccount');
var Response = require('../utils/response');
var Mongo = require('../mongo/database');
var ObjectId = require('mongodb').ObjectId;
var DZ = require('node-deezer');
var deezerApi = new DZ();
var typesAvailable = ["albums","artists","playlists","tracks","radios"];

bluebird.promisifyAll(deezerApi);

module.exports = {
    getHistory: function(req,res,next){

    },
    getFullHistory: function(req,res,next){
        console.warn('The history function should be used one time by account !');
        //before importing something delete all history
        Mongo.db.collection('histories').deleteMany({deezerAccount:req.params.deezerId})
            .then(res => {
                return deezerModel.get(req.params.deezerId);// now get the access token from the account
            })
            .then(deezerAccount => {
                return deezerApi.requestAsync(deezerAccount.accessToken, {
                        resource : 'user/' + deezerAccount.id + '/history',
                        method : 'get'
                    });
            })
            .then(history => {
                for (var i = 0; i < history.data.length; i++) {
                    var track = history.data[i];
                    track.deezerAccount = new ObjectId(req.params.deezerId);
                }
                return Mongo.db.collection('histories').insertMany(history.data);
            })
            .then(wrote => {
                res.status(200).send(wrote);
            })
            .catch(err => {
                if(!err.code) err.code = 500;
                console.error(err);
                res.status(err.code).send(err);
            });
    },
    getRecommendations : function(req, res, next){

        if(!req.params.type) throw new Response(400,"BAD_REQUEST");
        if(!typesAvailable.includes(req.params.type)) throw new Response(404,"TYPE_NOT_AVAILABLE");

        //delete old recommendations
        Mongo.db.collection('recommendations').deleteMany({deezerAccount : req.params.deezerId, type : req.params.type})
            .then(res =>{
                return deezerModel.get(req.params.deezerId);// now get the access token from the account
            })
            .then(deezerAccount => {
                return deezerApi.requestAsync(deezerAccount.accessToken, { //get recommendations
                    resource: 'user/' + deezerAccount.id + '/recommendations/' + req.params.type,
                    method: 'get'
                })
            })
            .then(recommendations => {
                //i got recommendations !
                for (let i = 0; i < recommendations.data.length; i++) {
                    let recommend = recommendations.data[i];
                    recommend.deezerAccount = new ObjectId(req.params.deezerId);
                }
                return Mongo.db.collection('recommendations').insertMany(recommendations.data);
            })
            .then(wrote =>{
                res.status(200).send(wrote);
            })
            .catch(err =>{
                if(!err.code) err.code = 500;
                console.error(err);
                res.status(err.code).send(err);
            });
    }
};