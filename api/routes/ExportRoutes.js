'use strict';
module.exports = function(app) {
  var Export = require('../controllers/ExportController');

  // TSDM run files
  // export
  app.route('/export/transaction/:transaction_id')
    .post(Export.generate_run_file_for_transaction);

}