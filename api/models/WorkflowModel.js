'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Defines the schema for the **Features**
// in the customer ALM system
var workflowSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  created_date: {
    type: Date,
    default: Date.now
  },
  testsuite: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Testsuite'
  },
  name: {
    type: String,
    required: 'Please enter the name of the Workflow'
  },
  alm_id: {
    type: String,
    required: 'Please enter the id for the Workflow from the ALM system'
  }
})
module.exports = mongoose.model('Workflow', workflowSchema);
