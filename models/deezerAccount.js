/**
 * Created by Thomas on 24/12/2016.
 */
const deezerAccountSchema = require('../schemas/deezerAccount');
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

var DeezerAccount = mongoose.model('DeezerAccount', deezerAccountSchema);

module.exports = {
    get: function (id) {
        return DeezerAccount.findById(id);
      },

    getByMultipleIds: function (ids) {
        var objectId = [];
        for (let id of ids) {
          objectId.push(new ObjectId(id));
        }

        return DeezerAccount.find({ _id: { $in: objectId } });
      },

    getByDeezerId: function (id) {
        return DeezerAccount.findOne({ id: id }).exec();
      },

    add: function (deezerAccount) {
        var newAccount = new DeezerAccount(deezerAccount);
        return newAccount.save();
      },

    edit: function (id, body, callback) {
        DeezerAccount.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: body }, {}, callback);
      },
  };
