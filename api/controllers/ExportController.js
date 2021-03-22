'use strict';
const JsonFind = require("json-find");
var mongoose = require('mongoose');
var path = require('path');
var mime = require('mime');
var fs = require('fs');
const { execSync } = require("child_process");

var Project = mongoose.model('Project'),
    Testsuite = mongoose.model('Testsuite'),
    Workflow = mongoose.model('Workflow'),
    Scenario = mongoose.model('Scenario'),
    Transaction = mongoose.model('Transaction'),
    Gherkinstep = mongoose.model('Gherkinstep'),
    Instruction = mongoose.model('Instruction'),
    Stepaction = mongoose.model('Stepaction');

exports.generate_run_file_for_transaction = async function (req, res) {
    const transaction_id = req.params.transaction_id;
    const publishedTC = await wipToPublishTransaction(transaction_id);
    const returnedResult = await buildTransactionRunfiles(transaction_id);
    let result = [];
    result.push(publishedTC);
    result.push(returnedResult);
    return res.json(result)
}

async function wipToPublishTransaction(transactionId) {
    let thisGherkinsteps = await Gherkinstep.find({transaction: transactionId}).exec();
    await Promise.all(thisGherkinsteps.map(x => moveWipToPublish(x)));
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
        let thisTransaction = await Transaction.findById(transactionId).exec();
        let thisGherkinsteps = await Gherkinstep.find({transaction: transactionId}).exec();
        for (const gherkinstep of thisGherkinsteps) {
            console.log(gherkinstep);
        }
        
        /*var tempPath = path.normalize(__dirname + `../../../published`);
        var outputFilePath = path.normalize(tempPath + `/${transaction.alm_id}.json`);
        var items = [];*/
    
        if (!fs.existsSync(tempPath)) {
          fs.mkdirSync(tempPath);
        }
    
       /* items.push({
          "ID": transaction.scenario.alm_id,
          "ParentID": null,
          "Data": {
            "Work Item Type": "User Story",
            "Title": transaction.scenario.name
          },
          "Children": []
        });
    
        items.push({
          "ID": transaction.alm_id,
          "ParentID": transaction.scenario.alm_id,
          "Data": {
            "Work Item Type": "Test Case",
            "Title": transaction.name
          },
          "Children": await generateTransactionChildren(transaction)
        });
        fs.writeFileSync(inputFilePath, JSON.stringify(items));
    
        var test = execSync(`TSDM.Excel.Exporter.exe "${inputFilePath}" "${outputFilePath}"`, { cwd: path.dirname(exporterFilePath) });
        console.log(test.toString());
    
        var outputname = path.basename(outputFilePath);
        var outputFile = path.normalize(outputFilePath);*/
    
      } catch (err) {
       return err
      }
}

const generateTransactionChildren = async function (transaction) {
  var items = []

  var steps = await Gherkinstep.find({ transaction: transaction._id }).exec();

  //Expected needs to be looked at as always PASS as value is at parent level
  for (var step of steps) {
    var item = {
      "ID": null,
      "ParentID": null,
      "Data": {
        "TransactionStep": `${step.gherkin_keyword} ${step.name}`,
        "Expected": "PASS"
      },
      "Children": []
    };

    //Find associated Step Action by name
    var stepAction = await Stepaction.find({ name: step.name })
      .populate('action')
      .populate('action.wip_step_collection', 'Action')
      .exec();

    if (stepAction && stepAction.length > 0) {
      item.Children = await generateStepActionChildren(stepAction[0]);
    }

    items.push(item);
  }
  return items;
}

const generateStepActionChildren = async function (stepAction) {
  var items = []

  var actionRefs = stepAction.wip_step_collection;

  for (var actionRef of actionRefs) {
    var action = await Action.findById(actionRef.action).exec();

    if (action) {
      items.push({
        "ID": null,
        "ParentID": null,
        "Data": {
          "StepAction": `${action.description}`,
          "Expected": `${action.expected_result}`
        },
        "Children": []
      });
    }

  }
  return items;
}
