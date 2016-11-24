/**
 * Created by Thomas on 23/11/2016.
 */
var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../config/configuration2');

/* GET home page. */
router.get('/getAccess/:token', function(req, res, next) {

    request('https://connect.deezer.com/oauth/access_token.php?' +
        'app_id=' + config.app.id +
        '&secret=' + config.app.secret +
        '&output=json' +
        '&code=' + req.params.token,
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body); //have to save it into mongo bro !
            }
    });


    res.send({});
});

module.exports = router;