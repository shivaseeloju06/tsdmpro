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
  //console.log(doc);
  const allProjects = await doc.findValues("projects");
  const allTestsuites = await doc.findValues("testsuites");
  const allWorkflows = await doc.findValues('workflows');
  const allScenarios = await doc.findValues('scenarios');
  const allTransactions = await doc.findValues('transactions');
  const allGherkinsteps = await doc.findValues('gherkinsteps');
  const projectResult = await addProjects(allProjects);
  const testsuiteResult = await addTestsuites(allTestsuites);
  const workflowResult = await addWorkflows(allWorkflows);
  const scenarioResult = await addScenarios(allScenarios);
  const transactionResult = await addTransactions(allTransactions);
  const gherkinstepResult = await addGherkinsteps(allGherkinsteps);
  let combined_response = [];
  combined_response.push(projectResult);
  combined_response.push(testsuiteResult);
  combined_response.push(workflowResult);
  combined_response.push(scenarioResult);
  combined_response.push(transactionResult);
  combined_response.push(gherkinstepResult);
  return res.json(combined_response)
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
  project.testsuites = [];
  await Project.findOneAndUpdate({name: project.name}, project, {returnOriginal: false, upsert: true}).exec();
}

async function addTestsuites(recJson) {
    var arrayCollection = recJson.testsuites;
    await Promise.all(arrayCollection.map(x => createTestsuite(x)));
    let counter = {};
    counter.testsuites_added = arrayCollection.length;
    return counter
}

async function createTestsuite(testsuitesuite) {
  testsuitesuite.workflows = [];
  var thisParent = await Project.findOne({alm_id: testsuitesuite.parent}).exec();
  testsuitesuite.project = thisParent._id;
  delete testsuitesuite['parent'];
  let addedtestsuite = await Testsuite.findOneAndUpdate( {name: element.name}, element, {returnOriginal: false, upsert: true}).exec()
  thisParent.testsuites.push(addedtestsuite._id),
  await thisParent.save();
}

function addWorkflows(recJson) {
  return new Promise(async function (resolve, reject) {
    var arrayCollection = recJson.workflows;
    console.log("***Workflows to import***");
    console.log(arrayCollection);
    for (const element of arrayCollection) {
      element.scenarios = [];
      var thisParent = await Testsuite.findOne({alm_id: element.parent}, async function (err) {
        if (err) {
          console.log(err);
          reject(err)
        }
      }).exec()
      element.testsuite = thisParent._id;
      delete element['parent'];
      let addedworkflow = await Workflow.findOneAndUpdate( {name: element.name}, element, {returnOriginal: false, upsert: true}, function (err) {
        if (err) {
          console.log(err);
          reject( err)
        };
      }).exec()
      thisParent.workflows.push(addedworkflow._id),
      await thisParent.save();
    };
    let counter = {};
    counter.workflows_added = arrayCollection.length;
    resolve(counter)
  })
}

function addScenarios(recJson) {
  return new Promise(async function (resolve, reject) {
    var arrayCollection = recJson.scenarios;
    console.log("***Scenarios to import***");
    console.log(arrayCollection);
    for (const element of arrayCollection) {
      element.transactions = [];
      var thisParent = await Workflow.findOne({alm_id: element.parent}, async function (err) {
        if (err) {
          console.log(err);
          reject(err)
        }
      }).exec()
      element.workflow = thisParent._id;
      delete element['parent'];
      let addedscenario = await Scenario.findOneAndUpdate( {name: element.name}, element, {returnOriginal: false, upsert: true}, function (err) {
        if (err) {
          console.log(err);
          reject( err)
        };
      }).exec()
      thisParent.scenarios.push(addedscenario._id),
      await thisParent.save();
    };
    let counter = {};
    counter.scenarios_added = arrayCollection.length;
    resolve(counter)
  })
}

function addTransactions(recJson) {
  return new Promise(async function (resolve, reject) {
    var arrayCollection = recJson.transactions;
    console.log("***Transactions to import***");
    console.log(arrayCollection);
    for (const element of arrayCollection) {
      element.gherkinsteps = [];
      var thisParent = await Scenario.findOne({alm_id: element.parent}, async function (err) {
        if (err) {
          console.log(err);
          reject(err)
        }
      }).exec()
      element.scenario = thisParent._id;
      delete element['parent'];
      let addedtransaction = await Transaction.findOneAndUpdate( {name: element.name}, element, {returnOriginal: false, upsert: true}, function (err) {
        if (err) {
          console.log(err);
          reject( err)
        };
      }).exec()
      thisParent.transactions.push(addedtransaction._id),
      await thisParent.save();
    };
    let counter = {};
    counter.transactions_added = arrayCollection.length;
    resolve(counter)
  })
}

function addGherkinsteps(recJson) {
  return new Promise(async function (resolve, reject) {
    var arrayCollection = recJson.gherkinsteps;
    console.log("***Gherkinsteps to import***");
    console.log(arrayCollection);
    for (const element of arrayCollection) {
      var thisParent = await Transaction.findOne({alm_id: element.parent}, async function (err) {
        if (err) {
          console.log(err);
          reject(err)
        }
      }).exec()
      element.transaction = thisParent._id;
      delete element['parent'];
      let addedgherkinstep = await Gherkinstep.findOneAndUpdate( {name: element.name}, element, {returnOriginal: false, upsert: true}, function (err) {
        if (err) {
          console.log(err);
          reject( err)
        };
      }).exec()
      thisParent.gherkinsteps.push(addedgherkinstep._id),
      await thisParent.save();
    };
    let counter = {};
    counter.gherkinsteps_added = arrayCollection.length;
    resolve(counter)
  })
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

