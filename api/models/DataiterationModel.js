'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Defines the schema for the **Features**
// in the customer ALM system
var dataiterationSchema = new Schema({
  created_date: {
    type: Date,
    default: Date.now
  },
  updated_date: {
    type: Date,
    default: Date.now
  },
  iteration: {
    type: Number,
    required: 'Please enter the iteration for the Key Value Pair',
    default: 1
  },
  environment: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Environment',
    required: 'Please enter the environment for the Key Value Pair'
  },
  keyvaluepairs: [
    {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Keyvaluepair'
    } 
  ]
})
//dataiterationSchema.index({'iteration': 1, 'environment': 1}, {unique: true});
dataiterationSchema.virtual('dataiteration_id').get(function(){
  return this._id;
});
module.exports = mongoose.model('Dataiteration', dataiterationSchema);
