'use strict';
const JsonFind = require("json-find");
var mongoose = require('mongoose');
var path = require('path');
var mime = require('mime');
var fs = require('fs');
const { execSync } = require("child_process");

var Project = mongoose.model('Project'),
  Testsuite = mongoose.model('Testsuite'),
  Transaction = mongoose.model('Transaction'),
  Scenario = mongoose.model('Scenario'),
  Gherkinstep = mongoose.model('Gherkinstep'),
  Stepaction = mongoose.model('Stepaction'),
  Action = mongoose.model('Action');

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
    }

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

exports.download_tfs_transaction_by_id = async function (req, res) {

  try {
    var transaction_id = req.params.id;
    var transaction = await Transaction.findById(transaction_id)
      .populate('scenario')
      .populate('gherkinsteps')
      .exec();

    var tempPath = path.normalize(__dirname + `../../../temp`);
    var exporterFilePath = path.normalize(__dirname + '../../../bin/TSDM.Excel.Exporter.exe');
    var outputFilePath = path.normalize(tempPath + `/WorkItem_${transaction.alm_id}.xlsx`);
    var inputFilePath = path.normalize(tempPath + `/WorkItem_${transaction.alm_id}.json`);
    var items = [];

    if (!fs.existsSync(tempPath)) {
      fs.mkdirSync(tempPath);
    }

    items.push({
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

    /* 
    {
      "ID": 134,
      "ParentID": 45,
      "Data": {
        "Work Item Type": "Test Case",
        "Title": "AC 40 - Another Test"
      },
      "Children": [
        {
          "ID": null,
          "ParentID": null,
          "Data": {
            "TransactionStep": "GIVEN I have navigated to the login page",
            "Expected": "PASS"
          },
          "Children": []
        },
        {
          "ID": null,
          "ParentID": null,
          "Data": {
            "TransactionAction": "Navigate to login page",
            "Expected": "PASS"
          },
          "Children": []
        },
        {
          "ID": null,
          "ParentID": null,
          "Data": {
            "TransactionStep": "WHEN {username} and {password} is entered",
            "Expected": "PASS"
          },
          "Children": []
        },
        {
          "ID": null,
          "ParentID": null,
          "Data": {
            "TransactionAction": "Enter username in username field",
            "Expected": "PASS"
          },
          "Children": []
        },
        {
          "ID": null,
          "ParentID": null,
          "Data": {
            "TransactionAction": "Enter password in password field",
            "Expected": "PASS"
          },
          "Children": []
        },
        {
          "ID": null,
          "ParentID": null,
          "Data": {
            "TransactionStep": "AND Login button in clicked",
            "Expected": "PASS"
          },
          "Children": []
        },
        {
          "ID": null,
          "ParentID": null,
          "Data": {
            "TransactionAction": "Click Login button",
            "Expected": "PASS"
          },
          "Children": []
        },
        {
          "ID": null,
          "ParentID": null,
          "Data": {
            "TransactionStep": "THEN {username} is logged in",
            "Expected": "PASS"
          },
          "Children": []
        },
        {
          "ID": null,
          "ParentID": null,
          "Data": {
            "TransactionAction": "Read username in logged in user label",
            "Expected": "PASS"
          },
          "Children": []
        }
      ]
    },*/

    fs.writeFileSync(inputFilePath, JSON.stringify(items));


    var test = execSync(`TSDM.Excel.Exporter.exe "${inputFilePath}" "${outputFilePath}"`, { cwd: path.dirname(exporterFilePath) });
    console.log(test.toString());

    var outputname = path.basename(outputFilePath);
    var outputFile = path.normalize(outputFilePath);
    var mimetype = mime.lookup(outputFilePath);

    res.setHeader('Content-disposition', 'attachment; filename=' + outputname);
    res.setHeader('Content-type', mimetype);

    var filestream = fs.createReadStream(outputFilePath);
    filestream.pipe(res);

  } catch (err) {
    res.status(500).send({ error: err });
  }
}


