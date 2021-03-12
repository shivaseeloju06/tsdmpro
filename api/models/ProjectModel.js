'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Defines the schema for the **Projects**
// in the customer ALM system
var projectSchema = new Schema({
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
  name: {
    type: String,
    required: 'Please enter the name of the Project',
    unique: true
  },
  url: {
    type: String,
    required: 'Please enter the URL of the Project',
    unique: true
  },
  alm_id: {
    type: String,
    required: 'Please enter the id for the Project from the ALM system',
    unique: true
  },
  testsuites: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Testsuite'
  }]
});
projectSchema.virtual('project_id').get(function(){
  return this._id;
});

module.exports = mongoose.model('Project', projectSchema);

