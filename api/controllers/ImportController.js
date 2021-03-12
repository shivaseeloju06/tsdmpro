'use strict';
var mongoose = require('mongoose'),
    Project = mongoose.model('Project'),
    Testsuite = mongoose.model('Testsuite'),
    Workflow = mongoose.model('Workflow'),
    Scenario = mongoose.model('Scenario'),
    Transaction = mongoose.model('Transaction'),
    Gherkinstep = mongoose.model('Gherkinstep');

exports.list_all_projects_and_children = function(req, res) {
        Project.find({}).populate({path:'testsuites',populate:{path:'workflows',model:'Workflow',populate:{path:'scenarios',model:'Scenario',populate:{path:'transactions',model:'Transaction',populate:{path:'gherkinsteps',model:'Gherkinstep'}}}}}).exec(function(err, project) {
          if (err) {
            res.send(err);
            console.log(err);
            return;
          };
          res.json(project);
        });
      };

exports.import__all_projects_and_children = async function(req, res) {
    res = loopData();
    console.log(importdata);
    res.json({"message":"done"});
};

// nested import code
async function loopData() {
  
}