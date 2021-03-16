'use strict';
const JsonFind = require("json-find");
var mongoose = require('mongoose');
var path = require('path');
var mime = require('mime');
var fs = require('fs');
const { execSync } = require("child_process");

var Project = mongoose.model('Project'),
  Testsuite = mongoose.model('Testsuite');

exports.downloadExcelDummy = async function (req, res) {

  var file = __dirname + '../../../bin/TSDM.Excel.Exporter.exe';
  var output = __dirname + '../../../bin/TSDM.xlsx';
  var jsonFile = __dirname + '../../../bin/TSDM.json';

  var projectID = req.query.projectID || "6049f040ada0794850f0deca";

  var test = execSync(`TSDM.Excel.Exporter.exe "Test.json" "TSDM.xlsx"`, { cwd: path.dirname(file) });
  console.log(test.toString());

  var outputname = path.basename(output);
  var outputFile = path.normalize(output);
  var mimetype = mime.lookup(output);

  res.setHeader('Content-disposition', 'attachment; filename=' + outputname);
  res.setHeader('Content-type', mimetype);

  var filestream = fs.createReadStream(output);
  filestream.pipe(res);

  // Testsuite.find({ project: projectID }, (err, testSuites) => {
  //   var items = [];

  //   testSuites.forEach(ts => {
  //     items.push({
  //       "ID": ts.alm_id,
  //       "ParentID": null,
  //       "Data": {
  //         "Work Item Type": "User Story",
  //         "Title": ts.name
  //       },
  //       "Children": []
  //     })
  //   });

  //   var jsonContent = JSON.stringify(items);
  //   console.log(jsonContent);

  //   fs.writeFileSync(jsonFile, jsonContent, 'utf8');


  //   var test = execSync(`TSDM.Excel.Exporter.exe "TSDM.json" "TSDM.xlsx"`, { cwd: path.dirname(file) });
  //   console.log(test.toString());

  //   var outputname = path.basename(output);
  //   var outputFile = path.normalize(output);
  //   var mimetype = mime.lookup(output);

  //   res.setHeader('Content-disposition', 'attachment; filename=' + outputname);
  //   res.setHeader('Content-type', mimetype);

  //   var filestream = fs.createReadStream(output);
  //   filestream.pipe(res);
  // });


  //res.send(200);
};


