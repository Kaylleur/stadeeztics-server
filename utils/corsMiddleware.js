/**
 * Created by Thomas on 04/02/2017.
 */
var config = require('../config/configuration');
//CORS middleware
module.exports = {

    allowCrossDomain : function(req, res, next) {
        res.header('Access-Control-Allow-Origin', config.cors.urls);
        res.header('Access-Control-Allow-Methods', config.cors.method);
        res.header('Access-Control-Allow-Headers', config.cors.headers);
        res.header('Content-Type','application/json; charset=utf-8')

        next();
    }

};
