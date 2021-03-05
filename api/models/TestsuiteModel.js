'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Defines the schema for the **Epics**
// in the customer ALM system
var testsuiteSchema = new Schema({
  created_date: {
    type: Date,
    default: Date.now
  },
  project: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project'
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
testsuiteSchema.virtual('testsuiteId').get(function(){
  return this._id;
});
module.exports = mongoose.model('Testsuite', testsuiteSchema);
