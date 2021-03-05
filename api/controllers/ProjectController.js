'use strict';
var mongoose = require('mongoose'),
Project = mongoose.model('Project');

exports.list_all_projects = function(req, res) {
  Project.find({}, function(err, project) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json(project);
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
  Project.remove({_id: req.params.projectId}, function(err, project) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    };
    res.json({ message: 'Project successfully deleted' });
  });
};

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
