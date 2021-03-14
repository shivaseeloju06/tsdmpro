'use strict';
module.exports = function(app) {
  var Action = require('../controllers/ActionController');

  // TSDM Routes
  // Actions
  app.route('/action')
    .get(Action.list_all_actions)
    .post(Action.create_an_action);

    app.route('/action/:id')
    .get(Action.read_an_action_by_id)
    .put(Action.update_an_action_by_id)
    .delete(Action.delete_an_action_by_id);

    app.route('/action/search/:description')
    .get(Action.list_all_actions_by_wildcard);
};