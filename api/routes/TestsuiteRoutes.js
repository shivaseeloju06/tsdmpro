'use strict';
module.exports = function(app) {
  var Testsuite = require('../controllers/TestsuiteController');

  // TSDM Routes
  // Test Suites (Epics)
  app.route('/testsuites')
    .get(Testsuite.list_all_testsuites)
    .post(Testsuite.create_a_testsuite);

  app.route('/testsuite/id/:testsuiteId')
    .get(Testsuite.read_a_testsuite_by_id)
    .put(Testsuite.update_a_testsuite_by_id)
    .delete(Testsuite.delete_a_testsuite_by_id);

  app.route('/testsuite/almid/:almId')
    .get(Testsuite.read_a_testsuite_by_alm_id)
    .put(Testsuite.update_a_testsuite_by_alm_id)
    .delete(Testsuite.delete_a_testsuite_by_alm_id);

  app.route('/testsuite/name/:name')
    .get(Testsuite.read_a_testsuite_by_name)
    .put(Testsuite.update_a_testsuite_by_name)
    .delete(Testsuite.delete_a_testsuite_by_name);
  };