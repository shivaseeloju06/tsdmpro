'use strict';
module.exports = function(app) {
  var Action = require('../controllers/ActionController');

  // TSDM Routes
  // Actions
  app.route('/action')
    .get(Action.list_all_actions)
    .post(Action.create_an_action);

  app.route('/action/:description')
    .get(Action.list_all_actions_by_wildcard);
};