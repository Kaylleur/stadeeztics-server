/**
 * Created by Thomas on 02/01/2017.
 */
var bluebird = require('bluebird'); // Promises
var userModel = require('../models/user');
var deezerModel = require('../models/deezerAccount');
var Response = require('../utils/response');
var DZ = require('node-deezer');
var deezerApi = new DZ();
var typesAvailable = ["albums","artists","playlists","tracks","radios"];

bluebird.promisifyAll(deezerApi);

module.exports = {
    getHistory: function(req,res,next){

    },
    getRecommendations : function(req, res, next){
        userModel.get(req.user._id)
            .then(user => {
                if(!req.params.deezerId || !req.params.type) throw new Response(400,"BAD_REQUEST");
                if(!typesAvailable.includes(req.params.type)) throw new Response(404,"TYPE_NOT_AVAILABLE");
                if(!user.deezerAccounts.includes(req.params.deezerId)) throw new Response(403,"ACCOUNT_NOT_BELONGING_TO_THIS_USER");

                return deezerModel.get(req.params.deezerId);
            })
            .then(deezerAccount => {
                return deezerApi.requestAsync(deezerAccount.accessToken, {
                    resource: 'user/' + deezerAccount.id + '/recommendations/' + req.params.type,
                    method: 'get'
                })
            })
            .then(recommendations => {
                //i got recommendations !
            })
            .catch(err =>{
                console.error(err);
                res.status(err.code).send(err);
            });
    }
};