'use strict';
var mongoose = require('mongoose');
var path = require('path');
var fs = require('fs');
var numeral = require('numeral');

var Project = mongoose.model('Project'),
    Testsuite = mongoose.model('Testsuite'),
    Workflow = mongoose.model('Workflow'),
    Scenario = mongoose.model('Scenario'),
    Transaction = mongoose.model('Transaction'),
    Gherkinstep = mongoose.model('Gherkinstep'),
    Instruction = mongoose.model('Instruction'),
    Stepaction = mongoose.model('Stepaction'),
    Dataiteration = mongoose.model('Dataiteration'),
    Action = mongoose.model('Action'),
    Environment = mongoose.model('Environment'),
    Keyvaluepair = mongoose.model('Keyvaluepair');

let gitClone = require('./gitCloneController.js');
let gitPull = require('./gitPullController');
let gitCheckout = require('./gitCheckoutController');
let gitPush = require('./gitPushController');
const REPO = "github.com/riaanroos/tsdm_test.git";
const localDir = "tsdm_test";
const USER = "riaanroos";
const PASS = "zpetesbcitcefornx6mj6xyxvpvij3tqozc35wjxmqfrnh2zg6ma";
const useSecureShell = true;

exports.generate_run_file_for_transaction = async function (req, res) {
    const transaction_id = req.params.transaction_id;
    const publishedTC = await wipToPublishTransaction(transaction_id);
    //const gitInit = await InitialiseGit
    const returnedResult = await buildTransactionRunfiles(transaction_id);
    let result = [];
    result.push(publishedTC);
    result.push(returnedResult);
    return res.json(result)
}

async function wipToPublishTransaction(transactionId) {
    let thisGherkinsteps = await Gherkinstep.find({transaction: transactionId}).exec();
    await Promise.all(thisGherkinsteps.map(x => moveWipToPublish(x)));
    return "Published WIP for: " + transactionId
}

async function moveWipToPublish(gherkinStep) {
    let thisStepaction = await Stepaction.findOne({name: gherkinStep.name}).exec();
    if (thisStepaction !== null && thisStepaction.wip_step_collection !== null) {
        thisStepaction.published_step_collection = thisStepaction.wip_step_collection;
        await thisStepaction.save()
    }
}

async function buildTransactionRunfiles(transactionId) {
  try {
    let publishDir = await createPublishedDir();

    // Get the full tree structure for the transaction
    let thisTransaction = await Transaction.findById(transactionId).exec();
    let thisScenario = await Scenario.findById(thisTransaction.scenario).exec();
    let thisWorkflow = await Workflow.findById(thisScenario.workflow).exec();
    let thisTestsuite = await Testsuite.findById(thisWorkflow.testsuite).exec();
    let thisProject = await Project.findById(thisTestsuite.project).exec();
    let thisGherkinsteps = await Gherkinstep.find({transaction: transactionId}).sort({index: 1}).exec();
    let dataIterations = await Dataiteration.find().populate('environment').populate('keyvaluepairs').sort({environment: 1, iteration: 1}).exec();

    // git checkout -b new branch
    /*Date.prototype.yyyymmdd = function() {
      var mm = this.getMonth() + 1; // getMonth() is zero-based
      var dd = this.getDate();
    
      return [this.getFullYear(),
              (mm>9 ? '' : '0') + mm,
              (dd>9 ? '' : '0') + dd
             ].join('');
    };*/
    let todayDate = new Date().getTime();
    let newBranchName = "Automation_" + todayDate + "_" + thisTransaction._id;
    await gitCheckout(publishDir, newBranchName);
    // Create missing env dir's
    await createEnvSubDirs(publishDir);

    let addedFiles = [];

    for (const thisDataiteration of dataIterations) {
      if (thisTransaction.tc_id === null || !thisTransaction.hasOwnProperty("tc_id")) {
        thisTransaction.tc_id = "";
      }
      // Create an empty driver file
      let driverFile;
      let driverFileContent = {"Driver": []};
      // Set driver file name to
      driverFile = thisDataiteration.environment.name + '_06_TC_' + thisTransaction.tc_id + '_US_' + thisScenario.alm_id + '_AC_' + thisTransaction.transaction_index + '_IT_' + numeral(thisDataiteration.iteration).format('00') + '_DriverSerial.json';
      // Create an empty instruction file
      let instructionFile = thisDataiteration.environment.name + '_06_TC_' + thisTransaction.tc_id + '_US_' + thisScenario.alm_id + '_AC_' + thisTransaction.transaction_index + '_IT_' + numeral(thisDataiteration.iteration).format('00') + '_Script.json';
      let instructionFileResult = thisDataiteration.environment.name + '_06_TC_' + thisTransaction.tc_id + '_US_' + thisScenario.alm_id + '_AC_' + thisTransaction.transaction_index + '_IT_' + numeral(thisDataiteration.iteration).format('00') + '_Output.txt';
      let instructionFileContent = [];

      // Build all the instructions for this instrtuction file
      for (const gherkinstep of thisGherkinsteps) {
        let counter = 1;
        const thisStepaction = await Stepaction.findOne({name: gherkinstep.name}).populate({path: 'published_step_collection.action', model: 'Action'}).exec();
        if (thisStepaction.published_step_collection !== null) {
          for (const step of thisStepaction.published_step_collection) {
            if (step.action !== null) {
              const instruction = await Instruction.findById(step.action.instruction).exec();
              const stepJason = {};
              stepJason.rowID = counter;
              stepJason.testCaseID = thisDataiteration.environment.name + '_TC_' + thisTransaction.tc_id + '_US_' + thisScenario.alm_id + '_AC_' + thisTransaction.transaction_index + '_STEP_' + gherkinstep.index + '_ROW_' + step.index + '_IT_' + numeral(thisDataiteration.iteration).format('00');
              stepJason.expectedResult = step.action.expected_result;
              stepJason.stepDescription = gherkinstep.name;
              stepJason.notes = gherkinstep.gherkin_keyword + ' ' + gherkinstep.name;
              stepJason.actionDescription = step.action.description;
              stepJason.instructionLibrary = instruction.library;
              stepJason.instruction = instruction.name;
              const validKeyvaluepairs = thisDataiteration.keyvaluepairs;
              let keyvaluepairFilter = [];
              for (const validkeyvaluepair of validKeyvaluepairs) {
                keyvaluepairFilter.push(validkeyvaluepair._id);
              }
              //console.log(keyvaluepairFilter);
              let x = 1;
              for (const args of step.action.argument_datatoken_pairs) {
                const keyvaluepair = await Keyvaluepair.findOne({'token_name': args.token_name, '_id': {$in: keyvaluepairFilter}}).exec();
                let argKey = 'arg' + x;
                stepJason[argKey] = keyvaluepair.value;
                x ++;
              }
              stepJason.acceptanceCriteria = thisTransaction.name;
              instructionFileContent.push(stepJason);
              counter ++;
            }
          }
        }
      }

      // Write Content to instruction file
      let thisInstructionFile = publishDir + '/' + thisDataiteration.environment.name + '/' + instructionFile;
      //let thisInstructionFileTxt = JSON.stringify(instructionFileContent)
      fs.writeFile(thisInstructionFile, JSON.stringify(instructionFileContent), function (err) {
        if (err)
        console.log(err);
          return err;
      });
      addedFiles.push('./' + thisDataiteration.environment.name + '/' + instructionFile);

      let tempContent = {
        "InputFileName": instructionFile, 
        "OutputFileName": instructionFileResult
      }

      driverFileContent.Driver.push(tempContent)
      let thisDriverFile = publishDir + '/' + thisDataiteration.environment.name + '/' + driverFile;
      fs.writeFile(thisDriverFile, JSON.stringify(driverFileContent), function (err) {
        if (err)
        console.log(err);
          return err;
      });
      addedFiles.push('./' + thisDataiteration.environment.name + '/' + driverFile);
    }  

    // TODOawait buildL5DriverSerial();
    // TODO await buildL4DriverSerial();
    // TODO await buildL3DriverSerial();
    // TODO await buildL2DriverSerial();
    // TODO await buildL1DriverSerial();

    // git add .
    // git commit -m
    // git push -u origin new branch
    // TODO git request-pull 
    await gitPush(REPO, publishDir, newBranchName, addedFiles, USER, PASS, useSecureShell);

    return 'Built Instruction files for: ' + transactionId

  } catch (err) {
    console.log(err);
      return err
  }
}

async function createPublishedDir() {
  try {
    // Create the output directory by removing it and then cloning from git
    let exportPath = path.normalize(__dirname + `../../../` + localDir);
    if (!fs.existsSync(exportPath)) {
      // git clone execution engine repo
      await gitClone(REPO, exportPath, USER, PASS, useSecureShell);
    } else {
      // git pull repo main branch
      await gitPull(REPO, exportPath, USER, PASS, useSecureShell);
    }
    return exportPath
  } catch (err) {
    if (err) throw err
  }
}

async function createEnvSubDirs(exportPath) {
  try {
    // Create output directory for each environment 
    const allEnvironments = await Environment.find().exec();
    for (const env of allEnvironments) {
      let envPath = path.normalize(exportPath + '/' + env.name);
      if (!fs.existsSync(envPath)) {
        fs.mkdirSync(envPath);
      } 
    }
  } catch (err) {
    if (err) throw err
  }
}

async function buildL5DriverSerial() {

}