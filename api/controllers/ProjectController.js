'use strict';
//import '.env/config';
var mongoose = require('mongoose'),
Project = mongoose.model('Project');
// Testsuite = mongoose.model('Testsuite');

exports.list_all_projects = function(req, res) {
  Project.find({}).populate('testsuite').exec(function(err, project) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(project);
    // TODO See why populate doesn't return the sub-documents
  });
};

exports.create_a_project = function(req, res) {
  var new_project = new Project(req.body);
  new_project.save(function(err, project) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(project);
  });
};

// TODO implement populate
exports.read_a_project_by_id = function(req, res) {
  Project.findById(req.params.projectId, function(err, project) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(project);
  });
};

exports.update_a_project_by_id = function(req, res) {
  Project.findOneAndUpdate({_id: req.params.projectId}, req.body, {new: true}, function(err, project) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(project);
  });
};

exports.delete_a_project_by_id = function(req, res) {
  // TODO Cascade deletions up and down
  Project.remove({_id: req.params.projectId}, function(err, project) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json({ message: 'Project successfully deleted' });
  });
};

// TODO implement populate
exports.read_a_project_by_alm_id = function(req, res) {
  Project.findOne({alm_id: req.params.almId}, function(err, project) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(project);
  });
};

exports.update_a_project_by_alm_id = function(req, res) {
  Project.findOneAndUpdate({alm_id: req.params.almId}, req.body, {new: true}, function(err, project) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(project);
  });
};

exports.delete_a_project_by_alm_id = function(req, res) {
  Project.findOneAndRemove({alm_id: req.params.almId}, function(err, project) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json({ message: 'Project successfully deleted' });
  });
};

// TODO implement populate
exports.read_a_project_by_name = function(req, res) {
  Project.findOne({name: req.params.name}, function(err, project) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(project);
  });
};

exports.update_a_project_by_name = function(req, res) {
  Project.findOneAndUpdate({name: req.params.name}, req.body, {new: true}, function(err, project) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(project);
  });
};

exports.delete_a_project_by_name = function(req, res) {
  Project.findOneAndRemove({name: req.params.name}, function(err, project) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json({ message: 'Project successfully deleted' });
  });
};

//TODO implement routes to CRUD a Project with embedded Testsuites
