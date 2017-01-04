/**
 * Created by Thomas on 02/01/2017.
 */
var express = require('express');
var router = express.Router();
var deezerController = require('../controllers/deezer');

router.get('/history/:deezerId', deezerController.getHistory);
router.get('/recommendations/:deezerId/:type', deezerController.getRecommendations);

module.exports = router;