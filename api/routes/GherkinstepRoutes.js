'use strict';
module.exports = function(app) {
  var Gherkinstep = require('../controllers/GherkinstepController');

  // TSDM Routes
  // Test Suites (Epics)
  app.route('/gherkinstep')
    .get(Gherkinstep.list_all_gherkinsteps)
    .post(Gherkinstep.create_a_gherkinstep);

  app.route('/gherkinstep/id/:gherkinstepId')
    .get(Gherkinstep.read_a_gherkinstep_by_id)
    .put(Gherkinstep.update_a_gherkinstep_by_id)
    .delete(Gherkinstep.delete_a_gherkinstep_by_id);

  app.route('/gherkinstep/name/:name')
    .get(Gherkinstep.read_a_gherkinstep_by_name)
    .put(Gherkinstep.update_a_gherkinstep_by_name)
    .delete(Gherkinstep.delete_a_gherkinstep_by_name);
  };