'use strict';
const JsonFind = require("json-find");
var mongoose = require('mongoose'),
    Project = mongoose.model('Project'),
    Testsuite = mongoose.model('Testsuite'),
    Workflow = mongoose.model('Workflow'),
    Scenario = mongoose.model('Scenario'),
    Transaction = mongoose.model('Transaction'),
    Gherkinstep = mongoose.model('Gherkinstep'),
    Instruction = mongoose.model('Instruction');

exports.list_all_projects_and_children = function(req, res) {
        Project.find({})
          .populate({path:'testsuites',populate:{path:'workflows',model:'Workflow',populate:{path:'scenarios',model:'Scenario',populate:{path:'transactions',model:'Transaction',populate:{path:'gherkinsteps',model:'Gherkinstep'}}}}})
          .exec(function(err, project) {
            if (err) {
              res.send(err);
              console.log(err);
              return;
            };
            res.json(project);
        });
      };

exports.import_all_projects_and_children = async function(req, res) {
  const doc = JsonFind(req.body);
  const allProjects = doc.findValues("projects");
  const allTestsuites = doc.findValues("testsuites");
  const allWorkflows = doc.findValues('workflows');
  const allScenarios = doc.findValues('scenarios');
  const allTransactions = doc.findValues('transactions');
  const allGherkinsteps = doc.findValues('gherkinsteps');
  try {
    const projectResult = await addProjects(allProjects, res);
    const testsuiteResult = await addTestsuites(allTestsuites, res);
    const workflowResult = await addWorkflows(allWorkflows, res);
    return {res, projectResult, testsuiteResult, workflowResult};
  }
  catch (err) {
    res.send(err);
    console.log(err);
    return;
  }
};

exports.import_all_instructions = async function(req, res) {
  var arrayCollection = req.body;
  var callback;
  const response = await Promise.all([
    addCollectionOfInstructions(arrayCollection, callback)
  ]);
  console.log(callback);
  return res.json(callback).sendStatus(200);
};

// nested import code
async function addProjects(recJson, res) {
  var arrayCollection = recJson.projects;
  await arrayCollection.forEach(function(element) {
    element.testsuites = [];
    var new_project = new Project(element);
    new_project.save(function(err, project) {
      if (err) {
        res.send(err);
        console.log(err);
        return;
      };
      return res.json(project);
    })
  })
};

async function addTestsuites(recJson, res) {
  var arrayCollection = recJson.testsuites;
  await arrayCollection.forEach(function(element) {
    element.workflows = [];
    var thisParent = Project.findOne({alm_id: element.parent}).then(async function(err, project) {
      if (err) {
        res.send(err);
        console.log(err);
        return;
      };
    });
    element.project = thisParent._id;
    var new_testsuite = new Testsuite(element);
    new_testsuite.save(function (err, testsuite) {
      if (err) {
        res.send(err);
        console.log(err);
        return;
      };
    })
    thisParent.testsuites.push(new_testsuite._id),
    thisParent.save();
  });
  return;
};

async function addCollectionOfInstructions(collection, response) {
  collection.forEach( function(element, response) {
    var new_instruction = new Instruction(element);
    new_instruction.save( function(err, instruction, res) {
      if (err) {
        //res.send(err);
        console.log(err);
        return res;
      };
      return res;
    });
    return response;
  })
  return response;
};
