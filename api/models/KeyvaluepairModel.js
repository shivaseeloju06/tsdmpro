'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Defines the schema for the **Features**
// in the customer ALM system
var keyvaluepairSchema = new Schema({
  created_date: {
    type: Date,
    default: Date.now
  },
  iteration: {
    type: Number,
    required: 'Please enter the iteration for the Key Value Pair'
  },
  environment: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Environment',
    required: 'Please enter the environment for the Key Value Pair'
  },
  name: {
    type: String,
    required: 'Please enter the name for the Key Value Pair'
  },
  value: {
    type: String,
    required: 'Please enter the name for the Key Value Pair'
  }  
})
keyvaluepairSchema.index({'iteration': 1, 'environment': 1, 'name': 1}, {unique: true});
keyvaluepairSchema.virtual('keyvaluepair_id').get(function(){
  return this._id;
});
module.exports = mongoose.model('Keyvaluepair', keyvaluepairSchema);
