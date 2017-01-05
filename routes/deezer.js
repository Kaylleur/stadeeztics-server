/**
 * Created by Thomas on 02/01/2017.
 */
var express = require('express');
var router = express.Router();
var deezerController = require('../controllers/deezer');

router.get('/:deezerId/history', deezerController.getFullHistory);
router.get('/:deezerId/recommendations/:type', deezerController.getRecommendations);

module.exports = router;