'use strict';
var mongoose = require('mongoose'),
  Dataiteration = mongoose.model('Dataiteration');

exports.list_all_dataiterations = function (req, res) {
  Dataiteration.find({}, function (err, dataiteration) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(dataiteration);
  });
};

exports.create_a_dataiteration = async function (req, res) {
  var new_dataiteration = new Dataiteration(req.body);
  new_dataiteration.save(function (err, dataiteration) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(dataiteration);
  });
};

exports.read_a_dataiteration_by_id = function (req, res) {
  Dataiteration.findById(req.params.id, function (err, dataiteration) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(dataiteration);
  });
};

exports.update_a_dataiteration_by_id = function (req, res) {
  Dataiteration.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, function (err, dataiteration) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(dataiteration);
  });
};

exports.delete_a_dataiteration_by_id = function (req, res) {
  Dataiteration.remove({ _id: req.params.id }, function (err, dataiteration) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json({ message: 'Dataiteration successfully deleted' });
  });
};

