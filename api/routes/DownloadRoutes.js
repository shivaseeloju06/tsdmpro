'use strict';
module.exports = function (app) {
  var Download = require('../controllers/DownloadController');

  // TSDM Routes
  // Actions
  app.route('/download/dummy')
    .get(Download.downloadExcelDummy);
};