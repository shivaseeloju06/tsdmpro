'use strict';
module.exports = function(app) {
  var Keyvaluepair = require('../controllers/KeyvaluepairController');

  // TSDM Routes
  // Key Value Pairs
  app.route('/keyvaluepair')
    .get(Keyvaluepair.list_all_keyvaluepairs)
    .post(Keyvaluepair.create_a_keyvaluepair);

  app.route('/keyvaluepair/:id')
    .get(Keyvaluepair.read_a_keyvaluepair_by_id)
    .put(Keyvaluepair.update_a_keyvaluepair_by_id)
    .delete(Keyvaluepair.delete_a_keyvaluepair_by_id);
};