/**
 * Created by Thomas on 24/11/2016.
 */
const mongoose = require('mongoose');

module.exports = {
    connect : function() {
        var result = mongoose.connect("mongodb://localhost:27017/stadeeztics");
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
           console.info('Connected successfully.');
        });
        return result;
    }

};
