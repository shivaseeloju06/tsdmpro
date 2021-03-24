'use strict';
const { json } = require("express");
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
  const allProjects = await doc.findValues("projects");
  const projectResult = await addProjects(allProjects);
  return res.json(projectResult)
}

exports.import_all_instructions = async function(req, res) {
  const arrayCollection = req.body;
  // let callback;
  // let response = await Promise.all([
  //   addCollectionOfInstructions(arrayCollection, callback)
  // ]);
  const returnCollection = await addCollectionOfInstructions(arrayCollection)
  return res.json(returnCollection); //.sendStatus(200);
}

// nested import code
async function addProjects(recJson) {
  const arrayCollection = recJson.projects;
  await Promise.all(arrayCollection.map(x => createProject(x)));
  let counter = {};
  counter.projects_added = arrayCollection.length;
  return counter
}

async function createProject(project) {
  const docProject = JsonFind(project);
  project.testsuites = [];
  await Project.findOneAndUpdate({name: project.name}, project, {new: true, upsert: true}).exec();
  const allTestsuites = docProject.findValues("testsuites");
  const testsuiteResult = await addTestsuites(allTestsuites);  
  return testsuiteResult
}

async function addTestsuites(recJson) {
    var arrayCollection = recJson.testsuites;
    await Promise.all(arrayCollection.map(x => createTestsuite(x)));
    let counter = {};
    counter.testsuites_added = arrayCollection.length;
    return counter
}

async function createTestsuite(testsuitesuite) {
  const docTestsuite = JsonFind(testsuitesuite)
  testsuitesuite.workflows = [];
  var thisParent = await Project.findOne({alm_id: testsuitesuite.parent}).exec();
  testsuitesuite.project = thisParent._id;
  delete testsuitesuite['parent'];
  let addedtestsuite = await Testsuite.findOneAndUpdate( {name: testsuitesuite.name}, testsuitesuite, {new: true, upsert: true}).exec()
  thisParent.testsuites.push(addedtestsuite._id),
  await thisParent.save();
  const allWorkflows = docTestsuite.findValues('workflows');
  const workflowResult = await addWorkflows(allWorkflows);
  return workflowResult
}

async function addWorkflows(recJson) {
    var arrayCollection = recJson.workflows;
    await Promise.all(arrayCollection.map(x => createWorkflow(x)));
    let counter = {};
    counter.workflows_added = arrayCollection.length;
    return counter
}

async function createWorkflow(workflow) {
  const docWorkflow = JsonFind(workflow)
  workflow.scenarios = [];
  var thisParent = await Testsuite.findOne({alm_id: workflow.parent}).exec()
  workflow.testsuite = thisParent._id;
  delete workflow['parent'];
  let addedworkflow = await Workflow.findOneAndUpdate( {name: workflow.name}, workflow, {new: true, upsert: true}).exec()
  thisParent.workflows.push(addedworkflow._id),
  await thisParent.save();
  const allScenarios = docWorkflow.findValues('scenarios');
  const scenarioResult = await addScenarios(allScenarios);
  return scenarioResult
}

async function addScenarios(recJson) {
  console.log(recJson);
  var arrayCollection = recJson.scenarios;
  await Promise.all(arrayCollection.map(x => createScenario(x)));
  let counter = {};
  counter.scenarios_added = arrayCollection.length;
  return counter
}

async function createScenario(scenario) {
  const docScenario = JsonFind(scenario)
  scenario.transactions = [];
  var thisParent = await Workflow.findOne({alm_id: scenario.parent}).exec();
  scenario.workflow = thisParent._id;
  delete scenario['parent'];
  let addedscenario = await Scenario.findOneAndUpdate( {name: scenario.name}, scenario, {new: true, upsert: true}).exec()
  thisParent.scenarios.push(addedscenario._id),
  await thisParent.save();
  const allTransactions = docScenario.findValues('transactions');
  const transactionResult = await addTransactions(allTransactions);
  return transactionResult
}

async function addTransactions(recJson) {
  var arrayCollection = recJson.transactions;
  await Promise.all(arrayCollection.map(x => createTransaction(x)));
  let counter = {};
  counter.transactions_added = arrayCollection.length;
  return counter
}

async function createTransaction(transaction) {
  const docTranssaction = JsonFind(transaction)
  transaction.gherkinsteps = [];
  var thisParent = await Scenario.findOne({alm_id: transaction.parent}).exec()
  transaction.scenario = thisParent._id;
  delete transaction['parent'];
  let addedtransaction = await Transaction.findOneAndUpdate( {name: transaction.name}, transaction, {new: true, upsert: true}).exec()
  thisParent.transactions.push(addedtransaction._id),
  await thisParent.save();
  const allGherkinsteps = docTranssaction.findValues('gherkinsteps');
  const gherkinstepResult = await addGherkinsteps(allGherkinsteps);
  return gherkinstepResult
}

async function addGherkinsteps(recJson) {
    var arrayCollection = recJson.gherkinsteps;
    await Promise.all(arrayCollection.map(x => creategherkinstep(x)));
    let counter = {};
    counter.gherkinsteps_added = arrayCollection.length;
    return counter
}

async function creategherkinstep(gherkinstep) {
  var thisParent = await Transaction.findOne({alm_id: gherkinstep.parent}).exec()
  gherkinstep.transaction = thisParent._id;
  delete gherkinstep['parent'];
  let addedgherkinstep = await Gherkinstep.findOneAndUpdate( {name: gherkinstep.name}, gherkinstep, {new: true, upsert: true}).exec()
  thisParent.gherkinsteps.push(addedgherkinstep._id),
  await thisParent.save();
}

function addCollectionOfInstructions(collection) {
  return new Promise(async function (resolve, reject) {
    for (const element of collection) {
      var new_instruction = new Instruction(element);
      new_instruction.save( function(err, instruction, res) {
        if (err) {
          console.log(err);
          reject(res)
        }
      })
    }
    let counter = {};
    counter.instructions_added = collection.length;
    resolve(counter)
  })
}

