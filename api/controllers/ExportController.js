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
    await createEnvSubDirs();

    // Get the full tree structure for the transaction
    let thisTransaction = await Transaction.findById(transactionId).exec();
    let thisScenario = await Scenario.findById(thisTransaction.scenario).exec();
    let thisWorkflow = await Workflow.findById(thisScenario.workflow).exec();
    let thisTestsuite = await Testsuite.findById(thisWorkflow.testsuite).exec();
    let thisProject = await Project.findById(thisTestsuite.project).exec();
    let thisGherkinsteps = await Gherkinstep.find({transaction: transactionId}).sort({index: 1}).exec();
    let dataIterations = await Dataiteration.find().populate('environment').populate('keyvaluepairs').sort({environment: 1, iteration: 1}).exec();

    for (const thisDataiteration of dataIterations) {
      // Create an empty driver file
      let driverFile;
      let driverFileContent = {"Driver": []};
      // Set driver file name to
      driverFile = thisDataiteration.environment.name + '_06_TC_' + thisTransaction.alm_id  + '_IT_' + numeral(thisDataiteration.iteration).format('00') + '_DriverSerial.json';
      // Create an empty instruction file
      let instructionFile = thisDataiteration.environment.name + '_06_TC_' + thisTransaction.alm_id + '_IT_' + numeral(thisDataiteration.iteration).format('00') + '_Script.json';
      let instructionFileResult = thisDataiteration.environment.name + '_06_TC_' + thisTransaction.alm_id + '_IT_' + numeral(thisDataiteration.iteration).format('00') + '_Output.txt';
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
              stepJason.testCaseID = thisDataiteration.environment.name + '_TC_' + thisTransaction.alm_id + '_IT_' + numeral(thisDataiteration.iteration).format('00') + '_STEP_' + gherkinstep.index + '_ROW_' + step.index;
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
    }  

    // await buildL5DriverSerial();

    return 'Built Instruction files for: ' + transactionId

  } catch (err) {
    console.log(err);
      return err
  }
}

async function createPublishedDir() {
  try {
    // Create the output directory
    let tempPath = path.normalize(__dirname + `../../../published`);
    if (!fs.existsSync(tempPath)) {
      fs.mkdirSync(tempPath);
    } 
    return tempPath
  } catch (err) {
    if (err) throw err
  }
}

async function createEnvSubDirs() {
  try {
    // Create output directory for each environment 
    let tempPath = path.normalize(__dirname + `../../../published`);
    const allEnvironments = await Environment.find().exec();
    for (const env of allEnvironments) {
      let envPath = path.normalize(tempPath + '/' + env.name);
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