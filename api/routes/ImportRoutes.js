'use strict';
module.exports = function(app) {
  var Import = require('../controllers/ImportController');

  // TSDM Routes
  // Import
  app.route('/import')
    .get(Import.list_all_projects_and_children)
    .post(Import.import__all_projects_and_children);
};