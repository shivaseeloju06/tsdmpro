'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Defines the schema for the **Features**
// in the customer ALM system
var environmentSchema = new Schema({
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
    required: 'Please enter the name for the Key Value Pair',
    unique: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project',
    required: 'Please provide a reference to the Project',
    sparse: true 
  }   
})
environmentSchema.virtual('environment_id').get(function(){
  return this._id;
});
module.exports = mongoose.model('Environment', environmentSchema);
