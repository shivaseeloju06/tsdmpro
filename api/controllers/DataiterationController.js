'use strict';
var mongoose = require('mongoose'),
  Dataiteration = mongoose.model('Dataiteration'),
  Tokenname = mongoose.model('Tokenname'),
  Keyvaluepair = mongoose.model('Keyvaluepair'),
  Stepaction = mongoose.model('Stepaction'),
  Environment = mongoose.model('Environment');

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
    .populate([
      {
        path: 'environment',
        model: 'Environment'
      },
      {
        path: 'keyvaluepairs',
        match: { token_name: { $in: usedTokens } },
        model: 'Keyvaluepair'
      }
    ])
    .sort({ environment: 1, iteration: 1 })
    .exec(function (err, dataiterations) {
      if (err) {
        console.log(err);
        return err
      }
      let returnArray = [];
      for (const iteration of dataiterations) {
        const record = {
          "_id": iteration._id,
          "environment": iteration.environment.name,
          "iteration": iteration.iteration
        };
        for (const datapair of iteration.keyvaluepairs) {
          record[datapair.token_name] = datapair.value;
        }
        returnArray.push(record);
      }
      res.send(returnArray);
    });
};

exports.update_all_dataiterations_for_stepactions = async function (req, res) {


  for (const di of req.body) {
    const keyValuePairs = await buildKeyValuePairs(di);
    const environment = await Environment.findOne({ name: di.environment }).exec();
    let dataIteration = await Dataiteration.findOne({ iteration: di.iteration, environment: environment._id }).exec();

    const keyValuePairIds = dataIteration.keyvaluepairs;
    for (const kvp of keyValuePairs) {
      await Keyvaluepair.findOneAndUpdate({ _id: { $in: keyValuePairIds }, token_name: kvp.token_name }, kvp, { new: true }, function (err, thisRecord) {
        if (err) {
          res.send(err);
          console.log(err);
          return;
        };
      });
    }
  }

  res.json(req.body);
}

// TODO MOve business logic into seperate controller

function buildKeyValuePairs(data) {
  let returnArray = [];
  for (const key of Object.keys(data)) {
    if (key !== "iteration" && key !== "environment") {
      let transposed = { "token_name": key, "value": data[key] };
      returnArray.push(transposed)
    }
  }
  return returnArray;
}

function fillIterationWithExistingTokens() {
  return new Promise(async function (resolve, reject) {
    var returnCollection = [];
    var allTokens = await getallTokens();
    for (const element of allTokens) {
      var thisKeyvaluepair = await createEmptyKeyvaluepair(element);
      returnCollection.push(thisKeyvaluepair._id);
    }
    resolve(returnCollection);
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

function getallTokens() {
  return new Promise(function (resolve, reject) {
    Tokenname.find({}, async function (err, tokenArray) {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(tokenArray);
    }).exec()
  })
}

function getAllUsedTokensByStepaction(stepaction_id) {
  return new Promise(async function (resolve, reject) {
    Stepaction.findById(stepaction_id)
      .populate({ path: 'wip_step_collection.action', model: 'Action' })
      .exec(async function (err, stepaction) {
        if (err) {
          console.log(err);
          rejecct(err);
        };
        var wip_step_collection = stepaction.wip_step_collection;
        var token_list = [];
        for (const element of wip_step_collection) {
          if (element.action != null) {
            var argument_datatoken_pairs = element.action.argument_datatoken_pairs;
            for (const pair of argument_datatoken_pairs) {
              token_list.push(pair.token_name);
            }
          }
        }
        resolve(token_list);
      })
  })
}

