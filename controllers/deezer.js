/**
    * Created by Thomas on 02/01/2017.
    * Project : server
 */
const Promise = require('bluebird'); // Promises
const deezerModel = require('../models/deezerAccount');
const Response = require('../utils/response');
const Mongo = require('../mongo/database');
const ObjectId = require('mongodb').ObjectId;
const DZ = require('node-deezer');
const url = require('url');

let deezerApi = new DZ();
let typesAvailable = ['albums', 'artists', 'playlists', 'tracks', 'radios'];
Promise.promisifyAll(deezerApi);

module.exports = {
    getHistory: function (req, res, next) {
        let timestamp, deezerAccount;
        Mongo.db.collection('histories').findOne({deezerAccount: new ObjectId(req.params.deezerId)},
            {sort: {timestamp: -1}, limit: 1})
            .then(lastTrack => { // get the most recent timestamp
                timestamp = lastTrack.timestamp;
                return timestamp;
            })
            .then(() => {
                return deezerModel.get(req.params.deezerId);// now get the access token from the account
            })
            .then(deezerFromDb => {
                deezerAccount = deezerFromDb;
                return deezerApi.requestAsync(deezerFromDb.accessToken, {
                    resource: 'user/' + deezerFromDb.id + '/history',
                    method: 'get'
                });
            })
            .then(processPartialHistory)
            .then(wrote => {
                res.status(200).send(wrote);
            })
            .catch(err => {
                if (!err.code) err.code = 500;
                console.error(err);
                res.status(err.code).send(err);
            });


        function processPartialHistory(history) {
            let lastHistoryTimestamp = history.data[history.data.length - 1].timestamp;
            let firstHistoryTimestamp = history.data[0].timestamp;
            console.log('Process history');
            console.log('My most recent timestamp ' + timestamp);
            console.log('the history last timestamp ' + lastHistoryTimestamp);
            return Promise.resolve(history.data)
                .each(addTrackOwner)
                .then(deleteIfNecessary)
                .then(function () {
                    return history.data;
                })
                .then(insertHistory)
                .then(function () {
                    return history;
                })
                .then(getNext);

            function getNext(history) {
                console.log('checking to take the next page or not');
                if (goToNext(history, timestamp)) {
                    let index = url.parse(history.next, true).query.index;
                    console.log('Going to index : ' + index);
                    return deezerApi.requestAsync(deezerAccount.accessToken, {
                        resource: 'user/' + deezerAccount.id + '/history',
                        method: 'get',
                        fields: {index: index}
                    }).then(processPartialHistory);
                }
                return Promise.resolve({message : "RECENT_HISTORY_HAS_BEEN_LOADED"});
            }


            function goToNext(history) {
                return (lastHistoryTimestamp > timestamp) && history.hasOwnProperty('next');
            }

            function deleteIfNecessary(history) {
                console.log('checking delete');
                if (lastHistoryTimestamp < timestamp && firstHistoryTimestamp != timestamp) {
                    console.log('i delete');
                    return Mongo.db.collection('histories').deleteMany({
                        deezerAccount: new ObjectId(req.params.deezerId),
                        timestamp: {$gte: lastHistoryTimestamp}
                    });
                }
            }

            function insertHistory(data) {
                console.log('checking insert');
                if (lastHistoryTimestamp != timestamp && firstHistoryTimestamp != timestamp) {
                    console.log('i insert !');
                    return Mongo.db.collection('histories').insertMany(data);
                }
            }

            function addTrackOwner(track) {
                track.deezerAccount = new ObjectId(req.params.deezerId);
                return Promise.resolve(track);
            }
        }

    },
    getFullHistory: function (req, res, next) {
        console.warn('The history function should be used one time by account !');
        let deezerAccount;
        //before importing something delete all history
        Mongo.db.collection('histories').deleteMany({deezerAccount: new ObjectId(req.params.deezerId)})
            .then(res => {
                return deezerModel.get(req.params.deezerId);// now get the access token from the account
            })
            .then(deezerFromDb => {
                deezerAccount = deezerFromDb;
                return deezerApi.requestAsync(deezerFromDb.accessToken, {
                    resource: 'user/' + deezerFromDb.id + '/history',
                    method: 'get'
                });
            })
            .then(processFullHistory)
            .then(wrote => {
                res.status(200).send(wrote);
            })
            .catch(err => {
                if (!err.code) err.code = 500;
                console.error(err);
                res.status(err.code).send(err);
            });

        function processFullHistory(history) {
            return Promise.resolve(history.data)
                .each(addTrackOwner)
                .then(insertHistory)
                .then(function () {
                    return history;
                })
                .then(getNext);

            function getNext(history) {
                if (hasNext(history)) {
                    let index = url.parse(history.next, true).query.index;
                    return deezerApi.requestAsync(deezerAccount.accessToken, {
                        resource: 'user/' + deezerAccount.id + '/history',
                        method: 'get',
                        fields: {index: index}
                    }).then(processFullHistory);
                }
                return Promise.resolve({message : "FULL_HISTORY_HAS_BEEN_LOADED"});
            }

            function hasNext(history) {
                return history.hasOwnProperty('next');
            }

            function insertHistory(data) {
                return Mongo.db.collection('histories').insertMany(data);
            }

            function addTrackOwner(track) {
                track.deezerAccount = new ObjectId(req.params.deezerId);
                return Promise.resolve(track);
            }
        }

    },
    getRecommendations : function (req, res, next) {

        if (!req.params.type) throw new Response(400, 'BAD_REQUEST');
        if (!typesAvailable.includes(req.params.type)) throw new Response(404, 'TYPE_NOT_AVAILABLE');

        //delete old recommendations
        Mongo.db.collection('recommendations').deleteMany({
            deezerAccount: req.params.deezerId,
            type: req.params.type
        })
            .then(res => {
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
            .then(wrote => {
                res.status(200).send(wrote);
            })
            .catch(err => {
                if (!err.code) err.code = 500;
                console.error(err);
                res.status(err.code).send(err);
            });
    }
};

