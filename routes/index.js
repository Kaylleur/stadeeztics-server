/**
 * Created by Thomas on 02/01/2017.
 * Project : server
 */
const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).send({message:'It works'});
});

module.exports = router;
