'use strict';
module.exports = function(app) {
  var Project = require('../controllers/ProjectController');

  // TSDM Routes
  // Projects
  app.route('/project')
    .get(Project.list_all_projects)
    .post(Project.create_a_project);

  app.route('/project/id/:projectId')
    .get(Project.read_a_project_by_id)
    .put(Project.update_a_project_by_id)
    .delete(Project.delete_a_project_by_id);

  app.route('/project/id/:projectId/testsuite')
    .get(Project.list_testsuites_by_project_id);

  app.route('/project/almid/:almId')
    .get(Project.read_a_project_by_alm_id)
    .put(Project.update_a_project_by_alm_id)
    .delete(Project.delete_a_project_by_alm_id);
  
  app.route('/project/name/:name')
    .get(Project.read_a_project_by_name)
    .put(Project.update_a_project_by_name)
    .delete(Project.delete_a_project_by_name);

  /*app.route('/project/testsuite/')
    .post(Project.create_a_project_with_testsuites);*/
};