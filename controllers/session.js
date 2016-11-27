/**
 * Created by Thomas on 27/11/2016.
 */
var userModel = require('../models/user');
var sha512 = require('sha512');
var config = require('../config/configuration');
var jwt = require('jsonwebtoken');


module.exports = {
    signIn : function(req,res,next){
        var password = sha512(config.salt.before + req.body + config.salt.after).toString('hex');
        userModel.signIn(req.body.name,password,function(err,result){
            try {
                if(err){
                    throw new Error(err.message);
                }
                console.log(result);
                var token = jwt.sign(result,config.jwt.secret,config.session);

                res.send({token : token});

                console.log(jwt.verify(token,config.jwt.secret,{algorithms:'HS512'}));

            }catch (exception){
                console.error(exception);
                res.status(500).send(exception);
            }
        });
    }
};