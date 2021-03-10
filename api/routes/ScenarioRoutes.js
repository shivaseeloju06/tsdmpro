'use strict';
module.exports = function(app) {
  var Scenario = require('../controllers/ScenarioController');

  // TSDM Routes
  // Test Suites (Epics)
  app.route('/scenario')
    .get(Scenario.list_all_scenarios)
    .post(Scenario.create_a_scenario);

  app.route('/scenario/id/:scenarioId')
    .get(Scenario.read_a_scenario_by_id)
    .put(Scenario.update_a_scenario_by_id)
    .delete(Scenario.delete_a_scenario_by_id);

  app.route('/scenario/id/:scenarioId/transaction')
    .get(Scenario.list_transactions_by_scenario_id);

  app.route('/scenario/almid/:almId')
    .get(Scenario.read_a_scenario_by_alm_id)
    .put(Scenario.update_a_scenario_by_alm_id)
    .delete(Scenario.delete_a_scenario_by_alm_id);

  app.route('/scenario/name/:name')
    .get(Scenario.read_a_scenario_by_name)
    .put(Scenario.update_a_scenario_by_name)
    .delete(Scenario.delete_a_scenario_by_name);
  };