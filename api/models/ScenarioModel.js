'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Defines the schema for the **User Stories**
// in the customer ALM system
var scenarioSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  created_date: {
    type: Date,
    default: Date.now
  },
  workflow_id: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Workflow'
  },
  name: {
    type: String,
    required: 'Please enter the name of the Scenario'
  },
  alm_id: {
    type: String,
    required: 'Please enter the id for the Scenario from the ALM system'
  }
})
module.exports = mongoose.model('Scenario', scenarioSchema);
