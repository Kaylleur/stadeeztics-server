/**
 * Created by Thomas on 02/01/2017.
 * Project : server
 */
const express = require('express');
const router = express.Router();
const deezerController = require('../controllers/deezer');

router.get('/:deezerId/history', deezerController.getHistory);
router.get('/:deezerId/fullHistory', deezerController.getFullHistory);
router.get('/:deezerId/recommendations/:type', deezerController.getRecommendations);

module.exports = router;
