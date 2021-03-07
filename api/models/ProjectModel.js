'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Defines the schema for the **Projects**
// in the customer ALM system
var projectSchema = new Schema({
  created_date: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    required: 'Please enter the name of the Project',
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

