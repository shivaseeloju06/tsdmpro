'use strict';
module.exports = function(app) {
  var Environment = require('../controllers/EnvironmentController');

  // TSDM Routes
  // Actions
  app.route('/environment')
    .get(Environment.list_all_environments)
    .post(Environment.create_an_environment);

  app.route('/environment/:id')
    .get(Environment.read_an_environment_by_id)
    .put(Environment.update_an_environment_by_id)
    .delete(Environment.delete_an_environment_by_id);
};