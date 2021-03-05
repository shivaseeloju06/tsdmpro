'use strict';
module.exports = function(app) {
  var tsdm_apiWorkflow = require('../controllers/WorkflowController');

  // TSDM Routes
  // Workflows (Features)
  app.route('/workflow')
    .get(tsdm_api.list_all_workflows)
    .post(tsdm_api.create_a_workflow);

  app.route('/workflow/:workflowId')
    .get(tsdm_api.read_a_workflow)
    .put(tsdm_api.update_a_workflow)
    .delete(tsdm_api.delete_a_workflow);
  };