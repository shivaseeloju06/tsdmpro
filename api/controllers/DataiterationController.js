'use strict';
var mongoose = require('mongoose'),
  Dataiteration = mongoose.model('Dataiteration'),
  Tokenname = mongoose.model('Tokenname'),
  Keyvaluepair = mongoose.model('Keyvaluepair');

exports.list_all_dataiterations = function (req, res) {
  Dataiteration.find({}, function (err, dataiteration) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(dataiteration);
  });
};

exports.create_a_dataiteration = async function (req, res) {
  var new_record = req.body;
  var keyvaluepairs = await fillIterationWithExistingTokens();
  new_record.keyvaluepairs = keyvaluepairs;
  var new_dataiteration = new Dataiteration(new_record);
  new_dataiteration.save(function (err, dataiteration) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(dataiteration);
  });
};

exports.read_a_dataiteration_by_id = function (req, res) {
  Dataiteration.findById(req.params.id, function (err, dataiteration) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(dataiteration);
  });
};

exports.update_a_dataiteration_by_id = function (req, res) {
  Dataiteration.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, function (err, dataiteration) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(dataiteration);
  });
};

exports.delete_a_dataiteration_by_id = function (req, res) {
  Dataiteration.remove({ _id: req.params.id }, function (err, dataiteration) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json({ message: 'Dataiteration successfully deleted' });
  });
};

exports.list_all_dataiterations_for_stepactions = function (req, res) {
  Dataiteration.find({}, function (err, dataiteration) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(dataiteration);
  });
};


// TODO MOve business logic into seperate controller

async function fillIterationWithExistingTokens() {
  return new Promise( async function (resolve, reject) {
    var returnCollection = [];
    var allTokens = await getallTokens();
    await allTokens.forEach(async function (element) {
      var thisKeyvaluepair = await createEmptyKeyvaluepair(element);
      returnCollection.push(thisKeyvaluepair._id);
    });
    console.log(returnCollection);
    resolve(returnCollection);
  });
};

async function createEmptyKeyvaluepair(token){
  return new Promise( async function (resolve, reject) {
    var new_keyvaluepair = new Keyvaluepair({"token_name": token.name, "value": ""});
    new_keyvaluepair.save(function (err, keyvaluepair) {
      if (err) {
        console.log(err);
        reject(err);
      };
    });
    resolve(new_keyvaluepair);
  });
};

async function getallTokens() {
  return new Promise( function (resolve, reject) {
    Tokenname.find({}, async function (err, tokenArray) {
      if (err) {
        console.log(err);
        reject(err);
      };
      resolve(tokenArray);
    }).exec();
  });
};

