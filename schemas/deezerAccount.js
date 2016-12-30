/**
 * Created by Thomas on 24/12/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var deezerAccountSchema = Schema({
    id: { type: Number, index: true, required : [ true, "Name is missing"] },
    name: { type: String, required : [ true, "Name is missing"] },
    accessToken: {type: String, required : [true,"No access token provided"]},
    email: String,
    status: Number,
    inscription_date: Date,
    gender: String,
    link: String,
    picture: String,
    picture_small: String,
    picture_medium: String,
    picture_big: String,
    picture_xl: String,
    country: String,
    lang: String,
    is_kid: Boolean,
    tracklist: String,
    type: String
},{
    versionKey: false
});


module.exports = deezerAccountSchema;