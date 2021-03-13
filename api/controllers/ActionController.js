'use strict';
const JsonFind = require("json-find");
var mongoose = require('mongoose'),
    Action = mongoose.model('Action');

exports.list_all_actions = function (req, res) {
  Action.find({})
    .exec(function (err, action) {
      if (err) {
        res.send(err);
        console.log(err);
        return;
      };
      res.json(action);
  });
};

exports.list_all_actions_by_wildcard = function (req, res) {
  Action.find({description: {$regex: req.params.description}})
    .exec(function (err, result){
      if (err) {
        res.send(err);
        console.log(err);
        return;
      };
      res.json(result);
    });
};

exports.create_an_action = function (req, res) {
  var new_action = new Action(req.body);
  new_action.save(function (err, action) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(action);
  });
};
