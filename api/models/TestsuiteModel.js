'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Defines the schema for the **Epics**
// in the customer ALM system
var testsuiteSchema = new Schema({
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
  project: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project',
    required: 'Please provide a reference to the Project',
    sparse: true 
  },
  name: {
    type: String,
    required: 'Please enter the name of the Test Suite',
    unique: true
  },
  alm_id: {
    type: String,
    required: 'Please enter the id for the Test Suite from the ALM system',
    unique: true
  },
  workflows: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Workflow'
  }]
})
testsuiteSchema.virtual('testsuite_id').get(function(){
  return this._id;
});
module.exports = mongoose.model('Testsuite', testsuiteSchema);
