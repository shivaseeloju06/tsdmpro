'use strict';
var mongoose = require('mongoose'),
Testsuite = mongoose.model('Testsuite');

exports.list_all_testsuites = function(req, res) {
  Testsuite.find({}, function(err, testsuite) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(testsuite);
  });
};

exports.create_a_testsuite = function(req, res) {
  var new_testsuite = new Testsuite(req.body);
  new_testsuite.save(function(err, testsuite) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(testsuite);
  });
};

exports.read_a_testsuite_by_id = function(req, res) {
  Testsuite.findById(req.params.testsuiteId, function(err, testsuite) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(testsuite);
  });
};

exports.update_a_testsuite_by_id = function(req, res) {
  Testsuite.findOneAndUpdate({_id: req.params.testsuiteId}, req.body, {new: true}, function(err, testsuite) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(testsuite);
  });
};

exports.delete_a_testsuite_by_id = function(req, res) {
  Testsuite.remove({_id: req.params.testsuiteId}, function(err, testsuite) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json({ message: 'Testsuite successfully deleted' });
  });
};

exports.read_a_testsuite_by_alm_id = function(req, res) {
  Testsuite.findOne({alm_id: req.params.almId}, function(err, testsuite) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(testsuite);
  });
};

exports.update_a_testsuite_by_alm_id = function(req, res) {
  Testsuite.findOneAndUpdate({alm_id: req.params.almId}, req.body, {new: true}, function(err, testsuite) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(testsuite);
  });
};

exports.delete_a_testsuite_by_alm_id = function(req, res) {
  Testsuite.findOneAndRemove({alm_id: req.params.almId}, function(err, testsuite) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json({ message: 'Testsuite successfully deleted' });
  });
};

exports.read_a_testsuite_by_name = function(req, res) {
  Testsuite.findOne({name: req.params.name}, function(err, testsuite) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(testsuite);
  });
};

exports.update_a_testsuite_by_name = function(req, res) {
  Testsuite.findOneAndUpdate({name: req.params.name}, req.body, {new: true}, function(err, testsuite) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(testsuite);
  });
};

exports.delete_a_testsuite_by_name = function(req, res) {
  Testsuite.findOneAndRemove({name: req.params.name}, function(err, testsuite) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json({ message: 'Testsuite successfully deleted' });
  });
};
