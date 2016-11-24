/**
 * Created by Thomas on 24/11/2016.
 */
var userModel = require('../models/user');

var request = require('request');
var config = require('../config/configuration')

module.exports = {
    signIn : function(req,res,next){
        request('https://connect.deezer.com/oauth/access_token.php?' +
            'app_id=' + config.app.id +
            '&secret=' + config.app.secret +
            '&output=json' +
            '&code=' + req.params.token,
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    userModel.add({
                        name:'undefined',
                        password: 'undefined',
                        mail:'undefined',
                        token: JSON.parse(body).access_token
                    },function(err,user){
                        if(!err){
                             res.send({message:'Successful'})
                        }
                    })
                }
            });

    }
};