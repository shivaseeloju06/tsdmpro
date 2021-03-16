'use strict';
const JsonFind = require("json-find");
var mongoose = require('mongoose');
var path = require('path');
var mime = require('mime');
var fs = require('fs');

exports.downloadExcelDummy = function (req, res) {
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=" + "Dummy.xlsx"
  );

  var file = __dirname + '../../../test.xlsx';

  var filename = path.basename(file);
  var mimetype = mime.lookup(file);

  res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  res.setHeader('Content-type', mimetype);

  var filestream = fs.createReadStream(file);
  filestream.pipe(res);
  //res.send(200);
};


