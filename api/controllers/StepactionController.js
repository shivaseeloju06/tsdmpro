'use strict';
const JsonFind = require("json-find");
var mongoose = require('mongoose'),
  Stepaction = mongoose.model('Stepaction'),
  Action = mongoose.model('Action');

exports.list_all_stepactions = function (req, res) {
  Stepaction.find({})
  .populate({path: 'wip_step_collection', populate: {path: "action", model: 'Action', populate: [{path: 'instruction', model: 'Instruction'}]}})
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
  .populate({path: 'wip_step_collection', populate: {path: "action", model: 'Action', populate: [{path: 'instruction', model: 'Instruction'}]}})
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
    .populate(({path: 'wip_step_collection', populate: {path: "action", model: 'Action', populate: [{path: 'instruction', model: 'Instruction'}]}}))
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
  console.log("Request received");
  console.log(req.body);
  var wip_action_collection = await buildCollection(req.body);
  Stepaction.findById(req.params.id)
    .exec( async function (err, stepaction) {
      stepaction.wip_step_collection = wip_action_collection;
      stepaction.save((e, updated) => {
        if (e) {
          res.send(e);
          console.log(e);
          return;
        };
        return updated;
      });
      let step_collection = await getStepCollection(stepaction);
      //console.log(step_collection);
      return res.json(step_collection);
    });
};

async function buildCollection(coll) {
  var return_collection = [];
  for (const element of coll) {
    if (element.action_id == null) {
      var new_action_array = {
        "description": element.description, 
        "expected_result": element.expected_result,
        "instruction": element.instructionID
      };
      var new_action = await createNewAction(new_action_array);
      //console.log(new_action);
      return_collection.push({"index": element.index, "action": new_action._id});
    } else {
      var thisAction = await Action.findById(element.action_id).exec();
      return_collection.push({"index": element.index, "action": thisAction._id});
    }
  }
  return return_collection;
};

async function createNewAction(rec) {
  var query = {"description": rec.description},
    options = { upsert: true, new: true, setDefaultsOnInsert: true };

  var new_action = Action.findOneAndUpdate(query, rec, options, function(error, result) {
    if (error) {
      console.log(error);
      return error;
    }
  })
  return new_action;
}

async function getStepCollection(request) {
  var returnArray = [];
  var thisStepAction = await Stepaction.findById(request._id)
    .populate({path: 'wip_step_collection.action', model: 'Action'}).exec();
  var wip_step_collection = thisStepAction.wip_step_collection;
  
  for (const element of wip_step_collection) {
    try {
      var line = {
        "action_id": element.action_id,
        "index": element.index,
        "description": element.action.description,
        "expected_result": element.action.expected_result,
        "instruction": element.action.instruction
      };
      returnArray.push(line);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  return returnArray;
}