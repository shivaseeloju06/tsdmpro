'use strict';
const fs = require('fs');
const { json } = require("express");
const JsonFind = require("json-find");
const mongoose = require('mongoose'),
    Project = mongoose.model('Project'),
    Testsuite = mongoose.model('Testsuite'),
    Workflow = mongoose.model('Workflow'),
    Scenario = mongoose.model('Scenario'),
    Transaction = mongoose.model('Transaction'),
    Gherkinstep = mongoose.model('Gherkinstep'),
    Instruction = mongoose.model('Instruction');

exports.generate_run_file_for_transaction = async function (req, res) {
    const transaction_id = req.params.transaction_id;
    const publishedTC = await publishTestCase(transaction_id);
    const returnedResult = await buildTransactionRunfiles(transaction_id);
    return res.json(returnedResult)
}

function publishTestCase(transactionId) {
    return new Promise(async function (resolve, reject) {
        let thisScenario = await Transaction.findById(transactionId).exec();
        //thisScenario.
    })
}

function buildTransactionRunfiles(transactionId) {
    return new Promise(async function (resolve, reject) {
        let transactionToExport = await Transaction.findById(transactionId)
        .populate([{path: 'scenario', model: 'Scenario'}, {path: 'gherkinsteps', model: 'Gherkinstep'}])    
        .exec();
        console.log(transactionToExport);
        resolve("OK")
    })
}

/*
{
    "rowID": "1",
    "testCaseID": "TSDM-0002_AC_01_TC_18828197_Step_01_Row_01_IT_01",
    "expectedResult": "PASS",
    "stepDescription": "Log on to the SAP Application",
    "notes": "GIVEN I have navigated to the SAP Application",
    "instructionLibrary": "Process",
    "instruction": "Start Process",
    "arg1": "C:/Program Files (x86)/SAP/FrontEnd/SAPgui/saplogon.exe",
    "acceptanceCriteria": "SAP Smoke Test"
}
*/