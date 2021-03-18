'use strict';
const JsonFind = require("json-find");
var mongoose = require('mongoose'),
    Action = mongoose.model('Action'),
    Dataiteration =mongoose.model('Dataiteration');

exports.list_all_actions = function (req, res) {
  Action.find({})
    .populate('instruction')
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
  .exec(function (err, result){
      if (err) {
        res.send(err);
        console.log(err);
        return;
      };
      res.json(result);
    });
};

exports.create_an_action = async function (req, res) {
  const doc = JsonFind(req.body);
  const allArgumentDatatokenPairs = doc.findValues("argument_datatoken_pairs");
  console.log(allArgumentDatatokenPairs);
  //await updateOrCreateDataPair();
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
