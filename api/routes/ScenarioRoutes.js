'use strict';
module.exports = function(app) {
  var Scenario = require('../controllers/ScenarioController');

  // TSDM Routes
  // Scenarios (User Stories)
  app.route('/scenario')
    .get(Scenario.list_all_scenarios)
    .post(Scenario.create_a_scenario);

  app.route('/scenario/:scenarioId')
    .get(Scenario.read_a_scenario)
    .put(Scenario.update_a_scenario)
    .delete(Scenario.delete_a_scenario);
  };