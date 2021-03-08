'use strict';
var mongoose = require('mongoose'),
Scenario = mongoose.model('Scenario'),
Workflow = mongoose.model('Workflow');

exports.list_all_scenarios = function(req, res) {
  Scenario.find({}, function(err, scenario) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(scenario);
  });
};

exports.create_a_scenario = async function(req, res) {
  var newBody = await getWorkflowId(req.body);
  console.log(newBody);
  var new_scenario = new Scenario(newBody);
    new_scenario.save(function(err, scenario) {
      if (err) {
        res.send(err);
        console.log(err);
        return;
      };
      pushScenarioToWorkflow(newBody.workflow, scenario.id);
      res.json(scenario);
  });
};

exports.read_a_scenario_by_id = function(req, res) {
  Scenario.findById(req.params.scenarioId, function(err, scenario) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(scenario);
  });
};

exports.update_a_scenario_by_id = function(req, res) {
  Scenario.findOneAndUpdate({_id: req.params.scenarioId}, req.body, {new: true}, function(err, scenario) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(scenario);
  });
};

exports.delete_a_scenario_by_id = function(req, res) {
  Scenario.remove({_id: req.params.scenarioId}, function(err, scenario) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json({ message: 'Scenario successfully deleted' });
  });
};

exports.read_a_scenario_by_alm_id = function(req, res) {
  Scenario.findOne({alm_id: req.params.almId}, function(err, scenario) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(scenario);
  });
};

exports.update_a_scenario_by_alm_id = function(req, res) {
  Scenario.findOneAndUpdate({alm_id: req.params.almId}, req.body, {new: true}, function(err, scenario) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(scenario);
  });
};

exports.delete_a_scenario_by_alm_id = function(req, res) {
  Scenario.findOneAndRemove({alm_id: req.params.almId}, function(err, scenario) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json({ message: 'Scenario successfully deleted' });
  });
};

exports.read_a_scenario_by_name = function(req, res) {
  Scenario.findOne({name: req.params.name}, function(err, scenario) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(scenario);
  });
};

exports.update_a_scenario_by_name = function(req, res) {
  Scenario.findOneAndUpdate({name: req.params.name}, req.body, {new: true}, function(err, scenario) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(scenario);
  });
};

exports.delete_a_scenario_by_name = function(req, res) {
  Scenario.findOneAndRemove({name: req.params.name}, function(err, scenario) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json({ message: 'Scenario successfully deleted' });
  });
};

async function getWorkflowId(passedBody) {
  try {
    var newBody = {"name":passedBody.name, "alm_id":passedBody.alm_id}
    switch(passedBody.workflow.search_by) {
      case "id":
        newBody.workflow = passedBody.workflow.value;
        break;
      case "name":
        var theParent = await Workflow.findOne({name: passedBody.workflow.value}).exec();
        newBody.workflow = theParent._id;
        break;
      case "alm_id":
        var theParent = await Workflow.findOne({alm_id: passedBody.workflow.value}).exec();
        newBody.workflow = theParent._id;
        break;
    };
  }
  catch (err) {
    return err;
  }
  return newBody;
};

async function pushScenarioToWorkflow(workflowId, scenarioId) {
  var parent_workflow = await Workflow.findById(workflowId, function(err, project) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
  });
  parent_workflow.scenarios.push(scenarioId);
  parent_workflow.save();
};
