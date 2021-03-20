'use strict';
var mongoose = require('mongoose'),
  Environment = mongoose.model('Environment'),
  Tokenname = mongoose.model('Tokenname'),
  Keyvaluepair = mongoose.model('Keyvaluepair'),
  Dataiteration = mongoose.model('Dataiteration'),
  Project = mongoose.model('Project');

exports.list_all_environments = function (req, res) {
  Environment.find({}, function (err, environment) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(environment);
  });
};

exports.create_an_environment = async function (req, res) {
  try {
    var project = await Project.findById(req.body.project).exec();
    var tokenCollection = await getallTokens();
    var emptyKeyValuePairs = await getEmptyKeyValuePairsFromTokens(tokenCollection);
    var new_environment = new Environment(req.body);
    new_environment.project = project;
    await new_environment.save();
    await createDataiteration(new_environment._id, "1", emptyKeyValuePairs);
    res.json(new_environment);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

exports.read_an_environment_by_id = function (req, res) {
  Environment.findById(req.params.id, function (err, environment) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(environment);
  });
};

exports.update_an_environment_by_id = function (req, res) {
  Environment.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, function (err, environment) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(environment);
  });
};

exports.delete_an_environment_by_id = function (req, res) {
  // TODO Delete dataiteration for environment
  Environment.remove({ _id: req.params.id }, function (err, environment) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json({ message: 'Environment successfully deleted' });
  });
};

// TODO Move business logic to seperate controller
function createDataiteration(env_id, iteration, keyvaluepairs) {
  return new Promise(function (resolve, reject) {
    var query = { $and: [{ environment: env_id }, { iteration: iteration }] },
      update = { "environment": env_id, "iteration": iteration, "keyvaluepairs": keyvaluepairs },
      options = { upsert: true, new: true, setDefaultsOnInsert: true };
    Dataiteration.findOneAndUpdate(query, update, options, function (error, result) {
      if (error) {
        console.log(error);
        reject(error);
      };
      resolve(result);
    }).exec();
  });
};

function getEmptyKeyValuePairsFromTokens(tokenNames) {
  return new Promise(async function (resolve, reject) {
    var returnArray = [];
    await tokenNames.forEach(async function (element) {
      var emptyKeyvaluepair = await createEmptyKeyvaluepair(element);
      returnArray.push(emptyKeyvaluepair._id);
    });
    resolve(returnArray);
  });
};

function getallTokens() {
  return new Promise(function (resolve, reject) {
    Tokenname.find({}, async function (err, tokenArray) {
      if (err) {
        console.log(err);
        reject(err);
      };
      resolve(tokenArray);
    }).exec();
  });
};

function createEmptyKeyvaluepair(token) {
  return new Promise(async function (resolve, reject) {
    var new_keyvaluepair = new Keyvaluepair({ "token_name": token.name, "value": "" });
    new_keyvaluepair.save(function (err, keyvaluepair) {
      if (err) {
        console.log(err);
        reject(err);
      };
    });
    resolve(new_keyvaluepair);
  });
};