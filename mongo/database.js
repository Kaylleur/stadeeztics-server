/**
 * Created by Thomas on 24/11/2016.
 */
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
mongoose.Promise = Promise;
//mongoose.Promise = require('bluebird'); //setup promise

let mongo = {
    connect: function () {
        let url = 'mongodb://localhost:27017/stadeeztics';
        let result = mongoose.connect(url);
        let mongooseDb = mongoose.connection;
        mongooseDb.on('error', console.error.bind(console, 'connection error:'));
        mongooseDb.once('open', function () {
            console.info('Connected successfully with Mongoose.');
        });

        MongoClient.connect(url, function (err, db) {
            if (err) console.error('connection error: ' + err);
            console.log('Connected successfully with Mongo ');
            mongo.db = db;
        });
    },
};

module.exports = mongo;
