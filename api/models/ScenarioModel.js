'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Defines the schema for the **User Stories**
// in the customer ALM system
var scenarioSchema = new Schema({
  created_date: {
    type: Date,
    default: Date.now
  },
  workflow: {
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
  },
  transactions: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Transaction'
  }]
})
scenarioSchema.virtual('scenario_id').get(function(){
  return this._id;
});
module.exports = mongoose.model('Scenario', scenarioSchema);
