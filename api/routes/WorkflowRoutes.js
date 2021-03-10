'use strict';
module.exports = function(app) {
  var Workflow = require('../controllers/WorkflowController');

  // TSDM Routes
  // Test Suites (Epics)
  app.route('/workflow')
    .get(Workflow.list_all_workflows)
    .post(Workflow.create_a_workflow);

  app.route('/workflow/id/:workflowId')
    .get(Workflow.read_a_workflow_by_id)
    .put(Workflow.update_a_workflow_by_id)
    .delete(Workflow.delete_a_workflow_by_id);

  app.route('/workflow/id/:workflowId/scenario')
    .get(Workflow.list_scenarios_by_workflow_id);

  app.route('/workflow/almid/:almId')
    .get(Workflow.read_a_workflow_by_alm_id)
    .put(Workflow.update_a_workflow_by_alm_id)
    .delete(Workflow.delete_a_workflow_by_alm_id);

  app.route('/workflow/name/:name')
    .get(Workflow.read_a_workflow_by_name)
    .put(Workflow.update_a_workflow_by_name)
    .delete(Workflow.delete_a_workflow_by_name);
  };