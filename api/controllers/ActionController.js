'use strict';
const JsonFind = require("json-find");
var mongoose = require('mongoose'),
    Action = mongoose.model('Action');

exports.list_all_actions = function (req, res) {
  Action.find({})
    .populate('instruction')
    .populate({path: 'test_data.environments.environment', model: 'Environment'})
    .populate({path: 'test_data.environments.datapairs.valuename', model: 'Keyvaluepair'})
    .exec(function (err, action) {
      if (err) {
        res.send(err);
        console.log(err);
        return;
      };
      res.json(action);
  });
};

exports.read_an_action_by_id = function (req, res) {
  Action.findById(req.params.id, function (err, action) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(action);
  });
};

exports.update_an_action_by_id = function (req, res) {
  Action.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, function (err, action) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(action);
  });
};

exports.delete_an_action_by_id = function (req, res) {
  Action.remove({ _id: req.params.id }, function (err, action) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json({ message: 'Action successfully deleted' });
  });
};

exports.list_all_actions_by_wildcard = function (req, res) {
  Action.find({description: {$regex: req.params.description,$options:'i'}})
  .populate('instruction')
  .populate({path: 'test_data.environments.environment', model: 'Environment'})
  .populate({path: 'test_data.environments.datapairs.valuename', model: 'Keyvaluepair'})
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
