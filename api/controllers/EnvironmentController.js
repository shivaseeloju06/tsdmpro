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
    let update = req.body;
    const filter = {project: project._id, name: update.name};
    const options = { upsert: true };
    update.project = project._id;
    //var new_environment = new Environment(req.body);
    //new_environment.project = project;
    //await new_environment.save();
    let new_environment = await Environment.findOneAndUpdate( filter, update, options, function (err, instruction, res) {
      if (err) {
        console.log(err);
        throw err
      }
    })
    await createDataiteration(new_environment, "1", emptyKeyValuePairs);
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

exports.create_an_environment_by_project_almid = async function (req, res) {
  try {
    //let newEnvironment = req.body;
    // console.log(req.params.almid);
    var project = await Project.findOne({alm_id: req.params.almid}).exec();
    //console.log("********************* Project *********************");
    //console.log(project);
    var tokenCollection = await getallTokens();
    var emptyKeyValuePairs = await getEmptyKeyValuePairsFromTokens(tokenCollection);
    let update = req.body;
    const filter = {project: project._id, name: update.name};
    const options = { upsert: true };
    update.project = project._id;
    //newEnvironment.project = project._id;
    //var new_environment = new Environment(newEnvironment);
    //new_environment.project = project;
    //await new_environment.save();
    let new_environment = await Environment.findOneAndUpdate( filter, update, options, function (errr, instruction, ress) {
      if (errr) {
        console.log(errr);
        throw errr
      }
    }).exec()
    //console.log("********************* New Environment *********************");
    //console.log(new_environment);
    await createDataiteration(new_environment, "1", emptyKeyValuePairs);
    res.json({"environment_added": new_environment.name});
  } catch (err) {
    console.log(err);
    res.send(err);
  }
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