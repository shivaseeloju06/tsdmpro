'use strict';
module.exports = function(app) {
  var Tokenname = require('../controllers/TokennameController');

  // TSDM Routes
  // Tokennames
  app.route('/tokenname')
    .get(Tokenname.list_all_tokennames)
    .post(Tokenname.create_a_tokenname);

    app.route('/tokenname/:id')
    .get(Tokenname.read_a_tokenname_by_id)
    .put(Tokenname.update_a_tokenname_by_id)
    .delete(Tokenname.delete_a_tokenname_by_id);

    app.route('/tokenname/search/:tokenname')
    .get(Tokenname.list_all_tokennames_by_wildcard);
};