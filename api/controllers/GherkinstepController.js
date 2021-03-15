'use strict';
var mongoose = require('mongoose'),
Gherkinstep = mongoose.model('Gherkinstep'),
Transaction = mongoose.model('Transaction');

exports.list_all_gherkinsteps = function(req, res) {
  Gherkinstep.find({}, function(err, gherkinstep) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(gherkinstep);
  });
};

exports.create_a_gherkinstep = async function(req, res) {
  var newBody = await getTransactionId(req.body);
  console.log(newBody);
  var new_gherkinstep = new Gherkinstep(newBody);
    new_gherkinstep.save( async function(err, gherkinstep) {
      if (err) {
        res.send(err);
        console.log(err);
        return;
      };
      await pushGherkinstepToTransaction(newBody.transaction, gherkinstep.id);
      await createEmptyStepActionCollection(gherkinstep.name);
      res.json(gherkinstep);
  });
};

exports.read_a_gherkinstep_by_id = function(req, res) {
  Gherkinstep.findById(req.params.gherkinstepId, function(err, gherkinstep) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(gherkinstep);
  });
};

exports.update_a_gherkinstep_by_id = function(req, res) {
  Gherkinstep.findOneAndUpdate({_id: req.params.gherkinstepId}, req.body, {new: true}, function(err, gherkinstep) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(gherkinstep);
  });
};

exports.delete_a_gherkinstep_by_id = function(req, res) {
    // TODO Cascade deletions up and down
Gherkinstep.remove({_id: req.params.gherkinstepId}, function(err, gherkinstep) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json({ message: 'Gherkinstep successfully deleted' });
  });
};

exports.read_a_gherkinstep_by_name = function(req, res) {
  Gherkinstep.findOne({name: req.params.name}, function(err, gherkinstep) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(gherkinstep);
  });
};

exports.update_a_gherkinstep_by_name = function(req, res) {
  Gherkinstep.findOneAndUpdate({name: req.params.name}, req.body, {new: true}, function(err, gherkinstep) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(gherkinstep);
  });
};

exports.delete_a_gherkinstep_by_name = function(req, res) {
  Gherkinstep.findOneAndRemove({name: req.params.name}, function(err, gherkinstep) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json({ message: 'Gherkinstep successfully deleted' });
  });
};

async function getTransactionId(passedBody) {
  try {
    var newBody = {"name":passedBody.name, "gherkin_keyword":passedBody.gherkin_keyword, "index":passedBody.index}
    switch(passedBody.transaction.search_by) {
      case "id":
        newBody.transaction = passedBody.transaction.value;
        break;
      case "name":
        var theParent = await Transaction.findOne({name: passedBody.transaction.value}).exec();
        newBody.transaction = theParent._id;
        break;
      case "alm_id":
        var theParent = await Transaction.findOne({alm_id: passedBody.transaction.value}).exec();
        newBody.transaction = theParent._id;
        break;
    };
  }
  catch (err) {
    return err;
  }
  return newBody;
};

async function pushGherkinstepToTransaction(transactionId, gherkinstepId) {
  console.log(gherkinstepId);
  var parent_transaction = await Transaction.findById(transactionId, function(err, project) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
  });
  parent_transaction.gherkinsteps.push(gherkinstepId);
  parent_transaction.save();
};

async function createEmptyStepActionCollection(name) {
  var query = {"name": name},
    update = { "name": name,  "wip_step_collection": []},
    options = { upsert: true, new: true, setDefaultsOnInsert: true };

  await Gherkinstep.findOneAndUpdate(query, update, options, function(error, result) {
    if (error) return;
  });
};
