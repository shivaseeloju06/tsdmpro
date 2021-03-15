'use strict';
module.exports = function(app) {
  var Stepaction = require('../controllers/StepactionController');

  // TSDM Routes
  // Actions
  app.route('/stepaction')
    .get(Stepaction.list_all_stepactions)
    .post(Stepaction.create_a_stepaction);

    app.route('/stepaction/:id')
    .get(Stepaction.read_a_stepaction_by_id)
    .put(Stepaction.update_a_stepaction_by_id)
    .delete(Stepaction.delete_a_stepaction_by_id);

    app.route('/stepaction/search/:description')
    .get(Stepaction.list_all_stepactions_by_wildcard);

    app.route('/stepaction/name/:name')
    .get(Stepaction.list_all_stepactions_by_name);

  };