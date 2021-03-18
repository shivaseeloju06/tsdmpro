'use strict';
var mongoose = require('mongoose'),
  Dataiteration = mongoose.model('Dataiteration'),
  Tokenname = mongoose.model('Tokenname'),
  Keyvaluepair = mongoose.model('Keyvaluepair'),
  Stepaction = mongoose.model('Stepaction');

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

exports.list_all_dataiterations_for_stepactions = async function (req, res) {
  var usedTokens = await getAllUsedTokensByStepaction(req.params.stepaction_id);
  Dataiteration.find()
    .populate('keyvaluepairs', null, { $in: usedTokens})
    .exec( function (err, dataiterations) {
      console.log(dataiterations);
      dataiterations = dataiterations.filter( function (dataiteration) {
        return dataiteration.keyvaluepairs.length;
      });
      // TODO transpose values
      res.send(dataiterations);
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

async function getAllUsedTokensByStepaction(stepaction_id) {
  return new Promise( async function (resolve, reject) {
    Stepaction.findById(stepaction_id)
      .populate({path: 'wip_step_collection.action', model: 'Action'})
      .exec( async function (err, stepaction) {
      if (err) {
        console.log(err);
        rejecct(err);
      };
      var wip_step_collection = stepaction.wip_step_collection;
      var token_list = [];
      await wip_step_collection.forEach(async function (element) {
        if (element.action != null) {
          var argument_datatoken_pairs = element.action.argument_datatoken_pairs;
          await argument_datatoken_pairs.forEach(async function (pair) {
            token_list.push(pair.token_name);
          });
        }
      });
      resolve(token_list);
    });
  });
};

