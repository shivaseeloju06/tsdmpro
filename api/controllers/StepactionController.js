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
  await Stepaction.findById(req.params.id, async function (err, stepaction) {
    var action_array = req.body;
    var wip_action_collection = [];
    await action_array.forEach(async (element) => {
      if (element.action_id == null) {
        var new_action_array = {
          "description": element.description, 
          "expected_result": element.expected_result,
          "instruction": element.instructionID,
          "test_data": element.test_data
        };
        var new_action = new Action(new_action_array);
        await new_action.save().exec(function (err, action) {
          if (err) {
            res.send(err);
            console.log(err);
            return;
          };
          //res.json(action);
        }); 
        wip_action_collection.push({"index": element.index, "action": new_action._id});
      } else {
        var thisaction = await Action.findById(element.action_id).exec();
        wip_action_collection.push({"index": element.index, "action": thisaction._id});
      }
    });

    stepaction.wip_step_collection = wip_action_collection;
    stepaction.save((e, updated) => {
      if (e) {
        //res.send(e);
        console.log(e);
        return;
      };
    });

    return res.json(stepaction.wip_step_collection);
  });
};