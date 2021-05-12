'use strict';
var mongoose = require('mongoose'),
Testsuite = mongoose.model('Testsuite'),
Project = mongoose.model('Project'),
Workflow = mongoose.model('Workflow');

exports.list_all_testsuites = function(req, res) {
  Testsuite.find({}, function(err, testsuite) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    }
    res.json(testsuite);
  });
}

exports.create_a_testsuite = async function(req, res) {
  var newBody = await getProjectId(req.body);
  var new_testsuite = new Testsuite(newBody);
  new_testsuite.save(function(err, testsuite) {
      if (err) {
        res.send(err);
        console.log(err);
        return;
      }
      pushTestsuiteToProject(newBody.project, testsuite.id);
      res.json(testsuite);
  });
}

exports.read_a_testsuite_by_id = function(req, res) {
  Testsuite.findById(req.params.testsuiteId, function(err, testsuite) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    }
    res.json(testsuite);
  });
}

exports.update_a_testsuite_by_id = function(req, res) {
  Testsuite.findOneAndUpdate({_id: req.params.testsuiteId}, req.body, {new: true}, function(err, testsuite) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    }
    res.json(testsuite);
  });
}

exports.delete_a_testsuite_by_id = function(req, res) {
  // TODO Cascade deletions up and down
  Testsuite.remove({_id: req.params.testsuiteId}, function(err, testsuite) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    }
    res.json({ message: 'Testsuite successfully deleted' });
  });
}

exports.list_workflows_by_testsuite_id = function(req, res) {
  Workflow.find({testsuite: req.params.testsuiteId}, function(err, workflows) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    }
    res.json(workflows);
  });
}

exports.read_a_testsuite_by_alm_id = function(req, res) {
  Testsuite.findOne({alm_id: req.params.almId}, function(err, testsuite) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    }
    res.json(testsuite);
  });
}

exports.update_a_testsuite_by_alm_id = function(req, res) {
  Testsuite.findOneAndUpdate({alm_id: req.params.almId}, req.body, {new: true}, function(err, testsuite) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    }
    res.json(testsuite);
  });
}

exports.delete_a_testsuite_by_alm_id = function(req, res) {
  Testsuite.findOneAndRemove({alm_id: req.params.almId}, function(err, testsuite) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    }
    res.json({ message: 'Testsuite successfully deleted' });
  });
}

exports.read_a_testsuite_by_name = function(req, res) {
  Testsuite.findOne({name: req.params.name}, function(err, testsuite) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    }
    res.json(testsuite);
  });
}

exports.update_a_testsuite_by_name = function(req, res) {
  Testsuite.findOneAndUpdate({name: req.params.name}, req.body, {new: true}, function(err, testsuite) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    }
    res.json(testsuite);
  });
}

exports.delete_a_testsuite_by_name = function(req, res) {
  Testsuite.findOneAndRemove({name: req.params.name}, function(err, testsuite) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    }
    res.json({ message: 'Testsuite successfully deleted' });
  });
}

async function getProjectId(passedBody) {
  try {
    var newBody = {"name":passedBody.name, "alm_id":passedBody.alm_id}
    switch(passedBody.project.search_by) {
      case "id":
        newBody.project = passedBody.project.value;
        break;
      case "name":
        var theParent = await Project.findOne({name: passedBody.project.value}).exec();
        newBody.project = theParent._id;
        break;
      case "alm_id":
        var theParent = await Project.findOne({alm_id: passedBody.project.value}).exec();
        newBody.project = theParent._id;
        break;
    }
  }
  catch (err) {
    return err;
  }
  return newBody;
}

async function pushTestsuiteToProject(projectId, testsuiteId) {
  var parent_project = await Project.findById(projectId, function(err, project) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    }
  });
  parent_project.testsuites.push(testsuiteId);
  parent_project.save();
}
