'use strict';
module.exports = function (app) {
  var Download = require('../controllers/DownloadController');

  // TSDM Routes
  // Actions
  app.route('/download/tfs/transaction/:id')
    .get(Download.download_tfs_transaction_by_id);
};