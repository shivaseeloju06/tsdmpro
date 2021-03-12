'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Defines the schema for the **Acceptance Criteria**
// in the customer ALM system
var transactionSchema = new Schema({
  is_active: {
    type: Boolean,
    default: 1
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  synced_date: {
    type: Date,
    default: Date.now
  },
  updated_date: {
    type: Date,
    default: Date.now
  },
  scenario: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Scenario'
  },
  name: {
    type: String,
    required: 'Please enter the name of the Transaction'
  },
  alm_id: {
    type: String,
    required: 'Please enter the id for the Transaction from the ALM system'
  },
  gherkinsteps: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Testsuite'
  }]
})
transactionSchema.virtual('transaction_id').get(function(){
  return this._id;
});
module.exports = mongoose.model('Transaction', transactionSchema);
