/**
 * Created by Thomas on 24/12/2016.
 */
const express = require('express');
const router = express.Router();
const config = require('../config/configuration');
const jwt = require('jsonwebtoken');

// route middleware to verify a token
router.use(function (req, res, next) {

    // check header or url parameters or post parameters for token
    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, config.jwt.secret, {algorithms: 'HS512'}, function (err, verify) {
            if (err) {
                return res.status(400).send({message: 'Failed to authenticate token.', err: err});
            } else {
                // if everything is good, save to request for use in other routes
                req.user = verify._doc;
                next();
            }
        });

    } else {
        // if there is no token
        // return an error
        return res.status(403).send({
            message: 'No token provided.'
        });
    }
});

module.exports = router;