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
  Gherkinstep = mongoose.model('Gherkinstep');

const generateTransactionChildren = async function (transaction) {
  var items = []

  var steps = await Gherkinstep.find({ transaction: transaction._id }).exec();

  for (var step of steps) {
    items.push({
      "ID": null,
      "ParentID": null,
      "Data": {
        "TransactionStep": `${step.gherkin_keyword} ${step.name}`,
        "Expected": "PASS"
      },
      "Children": []
    });
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

    var exporterFilePath = path.normalize(__dirname + '../../../bin/TSDM.Excel.Exporter.exe');
    var outputFilePath = path.normalize(__dirname + `../../../temp/WorkItem_${transaction.alm_id}.xlsx`);
    var inputFilePath = path.normalize(__dirname + `../../../temp/WorkItem_${transaction.alm_id}.json`);
    var items = [];

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
};


