'use strict';
var mongoose = require('mongoose'),
  Keyvaluepair = mongoose.model('Keyvaluepair');

exports.list_all_keyvaluepairs = function (req, res) {
  Keyvaluepair.find({}, function (err, keyvaluepair) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(keyvaluepair);
  });
};

exports.create_a_keyvaluepair = async function (req, res) {
  var new_keyvaluepair = new Keyvaluepair(req.body);
  new_keyvaluepair.save(function (err, keyvaluepair) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(keyvaluepair);
  });
};

exports.read_a_keyvaluepair_by_id = function (req, res) {
  Keyvaluepair.findById(req.params.id, function (err, keyvaluepair) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(keyvaluepair);
  });
};

exports.update_a_keyvaluepair_by_id = function (req, res) {
  Keyvaluepair.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, function (err, keyvaluepair) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(keyvaluepair);
  });
};

exports.delete_a_keyvaluepair_by_id = function (req, res) {
  Keyvaluepair.remove({ _id: req.params.id }, function (err, keyvaluepair) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json({ message: 'Keyvaluepair successfully deleted' });
  });
};

