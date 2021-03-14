'use strict';
var mongoose = require('mongoose'),
  Environment = mongoose.model('Environment');

exports.list_all_environments = function (req, res) {
  Environment.find({}, function (err, environment) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(environment);
  });
};

exports.create_an_environment = async function (req, res) {
  var new_environment = new Environment(req.body);
  new_environment.save(function (err, environment) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(environment);
  });
};

exports.read_an_environment_by_id = function (req, res) {
  Environment.findById(req.params.id, function (err, environment) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(environment);
  });
};

exports.update_an_environment_by_id = function (req, res) {
  Environment.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, function (err, environment) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(environment);
  });
};

exports.delete_an_environment_by_id = function (req, res) {
  Environment.remove({ _id: req.params.id }, function (err, environment) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json({ message: 'Environment successfully deleted' });
  });
};

