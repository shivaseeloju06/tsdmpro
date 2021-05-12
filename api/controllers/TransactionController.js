'use strict';
var mongoose = require('mongoose'),
  Transaction = mongoose.model('Transaction'),
  Scenario = mongoose.model('Scenario'),
  Gherkinstep = mongoose.model('Gherkinstep');

exports.list_all_transactions = function (req, res) {
  Transaction.find({}, function (err, transaction) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    }
    res.json(transaction);
  });
}

exports.create_a_transaction = async function (req, res) {
  var newBody = await getScenarioId(req.body);
  var new_transaction = new Transaction(newBody);
  new_transaction.save(function (err, transaction) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    }
    pushTransactionToScenario(newBody.scenario, transaction.id);
    res.json(transaction);
  });
}

exports.read_a_transaction_by_id = function (req, res) {
  Transaction.findById(req.params.transactionId, function (err, transaction) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    }
    res.json(transaction);
  });
}

exports.update_a_transaction_by_id = function (req, res) {
  Transaction.findOneAndUpdate({ _id: req.params.transactionId }, req.body, { new: true }, function (err, transaction) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    }
    res.json(transaction);
  });
}

exports.delete_a_transaction_by_id = function (req, res) {
  // TODO Cascade deletions up and down
  Transaction.remove({ _id: req.params.transactionId }, function (err, transaction) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    }
    res.json({ message: 'Transaction successfully deleted' });
  });
}


exports.list_gherkinsteps_by_transaction_id = async function (req, res) {
  try {
    var gherkinsteps = await Gherkinstep.find({ transaction: req.params.transactionId }).sort({ index: 1 }).exec();
    res.json(gherkinsteps);
  } catch (err) {
    res.status(500).send({ error: err });
  }
}

exports.read_a_transaction_by_alm_id = function (req, res) {
  Transaction.findOne({ alm_id: req.params.almId }, function (err, transaction) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    }
    res.json(transaction);
  });
}

exports.update_a_transaction_by_alm_id = function (req, res) {
  Transaction.findOneAndUpdate({ alm_id: req.params.almId }, req.body, { new: true }, function (err, transaction) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    }
    res.json(transaction);
  })
}

exports.delete_a_transaction_by_alm_id = function (req, res) {
  Transaction.findOneAndRemove({ alm_id: req.params.almId }, function (err, transaction) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    }
    res.json({ message: 'Transaction successfully deleted' });
  })
}

exports.read_a_transaction_by_name = function (req, res) {
  Transaction.findOne({ name: req.params.name }, function (err, transaction) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    }
    res.json(transaction);
  })
}

exports.update_a_transaction_by_name = function (req, res) {
  Transaction.findOneAndUpdate({ name: req.params.name }, req.body, { new: true }, function (err, transaction) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    }
    res.json(transaction);
  })
}

exports.delete_a_transaction_by_name = function (req, res) {
  Transaction.findOneAndRemove({ name: req.params.name }, function (err, transaction) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    }

    res.json({ message: 'Transaction successfully deleted' });
  })
}

/*
exports.publish_a_transaction = async function (req, res) {
  const transaction_id = req.params.transaction_id;
  let thisTransaction = await Transaction.findOn
}*/

async function getScenarioId(passedBody) {
  try {
    var newBody = { "name": passedBody.name, "alm_id": passedBody.alm_id }
    switch (passedBody.scenario.search_by) {
      case "id":
        newBody.scenario = passedBody.scenario.value;
        break;
      case "name":
        var theParent = await Scenario.findOne({ name: passedBody.scenario.value }).exec();
        newBody.scenario = theParent._id;
        break;
      case "alm_id":
        var theParent = await Scenario.findOne({ alm_id: passedBody.scenario.value }).exec();
        newBody.scenario = theParent._id;
        break;
    }
  }
  catch (err) {
    return err;
  }
  return newBody;
}

async function pushTransactionToScenario(scenarioId, transactionId) {
  var parent_scenario = await Scenario.findById(scenarioId, function (err, project) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    }
  });
  parent_scenario.transactions.push(transactionId);
  parent_scenario.save();
}
