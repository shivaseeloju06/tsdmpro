'use strict';
const JsonFind = require("json-find");
var mongoose = require('mongoose'),
  Stepaction = mongoose.model('Stepaction'),
  Action = mongoose.model('Action');

exports.list_all_stepactions = function (req, res) {
  Stepaction.find({})
  .populate({path: 'wip_step_collection', populate: {path: "action", model: 'Action', populate: [{path: 'instruction', model: 'Instruction'}, {path: 'test_data.environments.environment', model: 'Environment'}, {path: 'test_data.environments.datapairs.valuename', model: 'Keyvaluepair', populate: {path: 'environment', model: 'Environment'}}]}})
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
  Stepaction.findById(req.params.id)
  .populate({path: 'wip_step_collection', populate: {path: "action", model: 'Action', populate: [{path: 'instruction', model: 'Instruction'}, {path: 'test_data.environments.environment', model: 'Environment'}, {path: 'test_data.environments.datapairs.valuename', model: 'Keyvaluepair', populate: {path: 'environment', model: 'Environment'}}]}})
  .exec( function (err, stepaction) {
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
  Stepaction.find({ name: { $regex: req.params.description } })
    .populate('action')
    .exec(function (err, result) {
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
  Stepaction.find({ name: req.params.name })
    .populate('action')
    .exec(function (err, result) {
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

exports.create_a_step_by_stepaction = async function (req, res) {
  var this_Stepaction = await Stepaction.findById(req.params.id).exec();

  var query = {"description": req.body.description},
    options = { upsert: true, new: true, setDefaultsOnInsert: true };
  var new_action_array = {
    "description": req.body.description, 
    "expected_result": req.body.expected_result,
    "instruction": req.body.instructionID,
    "test_data": req.body.test_data
  };
  
  var new_action = await Action.findOneAndUpdate(query, new_action_array, options, function(error, result) {
  if (error) return;
  });

  this_Stepaction.wip_step_collection.push({"index": req.body.index, "action": new_action});
  this_Stepaction.save((e, updated) => {
    if (e) {
      res.send(e);
      console.log(e);
      return;
    };
  });

  return res.json(new_action);
};

