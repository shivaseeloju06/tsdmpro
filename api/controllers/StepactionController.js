'use strict';
const JsonFind = require("json-find");
var mongoose = require('mongoose'),
    Stepaction = mongoose.model('Stepaction');

exports.list_all_stepactions = function (req, res) {
  Stepaction.find({})
    .populate('action')
    .exec(function (err, stepaction) {
      if (err) {
        res.send(err);
        console.log(err);
        return;
      };
      res.json(stepaction);
  });
};

exports.read_a_stepaction_by_id = function (req, res) {
  Stepaction.findById(req.params.id, function (err, stepaction) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(stepaction);
  });
};

exports.update_a_stepaction_by_id = function (req, res) {
  Stepaction.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, function (err, stepaction) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(stepaction);
  });
};

exports.delete_a_stepaction_by_id = function (req, res) {
  Stepaction.remove({ _id: req.params.id }, function (err, stepaction) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json({ message: 'Stepaction successfully deleted' });
  });
};

exports.list_all_stepactions_by_wildcard = function (req, res) {
  Stepaction.find({name: {$regex: req.params.description}})
    .exec(function (err, result){
      if (err) {
        res.send(err);
        console.log(err);
        return;
      };
      res.json(result);
    });
};

exports.list_all_stepactions_by_name = function (req, res) {
  console.log(req.params.name);
  Stepaction.find({name: req.params.name})
    .populate('action')
    .exec(function (err, result){
      if (err) {
        res.send(err);
        console.log(err);
        return;
      };
      res.json(result);
    });
};

exports.create_a_stepaction = function (req, res) {
  var new_stepaction = new Stepaction(req.body);
  new_stepaction.save(function (err, stepaction) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(stepaction);
  });
};
