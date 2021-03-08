'use strict';
module.exports = function(app) {
  var Transaction = require('../controllers/TransactionController');

  // TSDM Routes
  // Test Suites (Epics)
  app.route('/transaction')
    .get(Transaction.list_all_transactions)
    .post(Transaction.create_a_transaction);

  app.route('/transaction/id/:transactionId')
    .get(Transaction.read_a_transaction_by_id)
    .put(Transaction.update_a_transaction_by_id)
    .delete(Transaction.delete_a_transaction_by_id);

  app.route('/transaction/almid/:almId')
    .get(Transaction.read_a_transaction_by_alm_id)
    .put(Transaction.update_a_transaction_by_alm_id)
    .delete(Transaction.delete_a_transaction_by_alm_id);

  app.route('/transaction/name/:name')
    .get(Transaction.read_a_transaction_by_name)
    .put(Transaction.update_a_transaction_by_name)
    .delete(Transaction.delete_a_transaction_by_name);
  };