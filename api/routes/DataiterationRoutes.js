'use strict';
module.exports = function(app) {
  var Dataiteration = require('../controllers/DataiterationController');

  // TSDM Routes
  // Dataiterations
  app.route('/dataiteration')
    .get(Dataiteration.list_all_dataiterations)
    .post(Dataiteration.create_a_dataiteration);

  app.route('/dataiteration/:id')
    .get(Dataiteration.read_a_dataiteration_by_id)
    .put(Dataiteration.update_a_dataiteration_by_id)
    .delete(Dataiteration.delete_a_dataiteration_by_id);
};