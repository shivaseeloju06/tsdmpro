'use strict';
var mongoose = require('mongoose'),
Workflow = mongoose.model('Workflow'),
Testsuite = mongoose.model('Testsuite'),
Scenario = mongoose.model('Scenario');

exports.list_all_workflows = function(req, res) {
  Workflow.find({}, function(err, workflow) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(workflow);
  });
};

exports.create_a_workflow = async function(req, res) {
  var newBody = await getTestsuiteId(req.body);
  var new_workflow = new Workflow(newBody);
    new_workflow.save(function(err, workflow) {
      if (err) {
        res.send(err);
        console.log(err);
        return;
      };
      pushWorkflowToTestsuite(newBody.testsuite, workflow.id);
      res.json(workflow);
  });
};

exports.read_a_workflow_by_id = function(req, res) {
  Workflow.findById(req.params.workflowId, function(err, workflow) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(workflow);
  });
};

exports.update_a_workflow_by_id = function(req, res) {
  Workflow.findOneAndUpdate({_id: req.params.workflowId}, req.body, {new: true}, function(err, workflow) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(workflow);
  });
};

exports.delete_a_workflow_by_id = function(req, res) {
  // TODO Cascade deletions up and down
  Workflow.remove({_id: req.params.workflowId}, function(err, workflow) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json({ message: 'Workflow successfully deleted' });
  });
};

exports.list_scenarios_by_workflow_id = function(req, res) {
  Scenario.find({workflow: req.params.workflowId}, function(err, scenarios) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(scenarios);
  });
};

exports.read_a_workflow_by_alm_id = function(req, res) {
  Workflow.findOne({alm_id: req.params.almId}, function(err, workflow) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(workflow);
  });
};

exports.update_a_workflow_by_alm_id = function(req, res) {
  Workflow.findOneAndUpdate({alm_id: req.params.almId}, req.body, {new: true}, function(err, workflow) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(workflow);
  });
};

exports.delete_a_workflow_by_alm_id = function(req, res) {
  Workflow.findOneAndRemove({alm_id: req.params.almId}, function(err, workflow) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json({ message: 'Workflow successfully deleted' });
  });
};

exports.read_a_workflow_by_name = function(req, res) {
  Workflow.findOne({name: req.params.name}, function(err, workflow) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(workflow);
  });
};

exports.update_a_workflow_by_name = function(req, res) {
  Workflow.findOneAndUpdate({name: req.params.name}, req.body, {new: true}, function(err, workflow) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(workflow);
  });
};

exports.delete_a_workflow_by_name = function(req, res) {
  Workflow.findOneAndRemove({name: req.params.name}, function(err, workflow) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json({ message: 'Workflow successfully deleted' });
  });
};

//Business Logic
async function getTestsuiteId(passedBody) {
  try {
    var newBody = {"name":passedBody.name, "alm_id":passedBody.alm_id}
    switch(passedBody.testsuite.search_by) {
      case "id":
        newBody.testsuite = passedBody.testsuite.value;
        break;
      case "name":
        var theParent = await Testsuite.findOne({name: passedBody.testsuite.value}).exec();
        newBody.testsuite = theParent._id;
        break;
      case "alm_id":
        var theParent = await Testsuite.findOne({alm_id: passedBody.testsuite.value}).exec();
        newBody.testsuite = theParent._id;
        break;
    };
  }
  catch (err) {
    return err;
  }
  return newBody;
};

async function pushWorkflowToTestsuite(testsuiteId, workflowId) {
  var parent_testsuite = await Testsuite.findById(testsuiteId, function(err, project) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
  });
  parent_testsuite.workflows.push(workflowId);
  parent_testsuite.save();
};
