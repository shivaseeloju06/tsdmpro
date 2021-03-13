'use strict';
const JsonFind = require("json-find");
var mongoose = require('mongoose'),
    Project = mongoose.model('Project'),
    Testsuite = mongoose.model('Testsuite'),
    Workflow = mongoose.model('Workflow'),
    Scenario = mongoose.model('Scenario'),
    Transaction = mongoose.model('Transaction'),
    Gherkinstep = mongoose.model('Gherkinstep');

exports.list_all_projects_and_children = function(req, res) {
        Project.find({})
          .populate({path:'testsuites',populate:{path:'workflows',model:'Workflow',populate:{path:'scenarios',model:'Scenario',populate:{path:'transactions',model:'Transaction',populate:{path:'gherkinsteps',model:'Gherkinstep'}}}}})
          .exec(function(err, project) {
            if (err) {
              res.send(err);
              console.log(err);
              return;
            };
            res.json(project);
        });
      };

exports.import__all_projects_and_children = async function(req, res) {
  const doc = JsonFind(req.body);
  const allProjects = doc.findValues("projects");
  const allTestsuites = doc.findValues("testsuites");
  try {
    const projectResult = await addProjects(allProjects, res);
    const testsuiteResult = await addTestsuites(allTestsuites, res);
    return {res, projectResult, testsuiteResult};
  }
  catch (err) {
    res.send(err);
    console.log(err);
    return;
  }
};

// nested import code
async function addProjects(recJson, res) {
  var arrayCollection = recJson.projects;
  await arrayCollection.forEach(function(element) {
    element.testsuites = [];
    var new_project = new Project(element);
    new_project.save(function(err, project) {
      if (err) {
        res.send(err);
        console.log(err);
        return;
      };
      return res.json(project);
    })
  })
}

async function addTestsuites(recJson, res) {
  var arrayCollection = recJson.testsuites;
  await arrayCollection.forEach(function(element) {
    element.workflows = [];
    var thisParent = Project.findOne({alm_id: element.parent}).then(async function(err, project) {
      if (err) {
        res.send(err);
        console.log(err);
        return;
      };
    });
    element.project = thisParent._id;
    var new_testsuite = new Testsuite(element);
    new_testsuite.save(function (err, testsuite) {
      if (err) {
        res.send(err);
        console.log(err);
        return;
      };
    })
    thisParent.testsuites.push(new_testsuite._id),
    thisParent.save();
  });
  return;
}
