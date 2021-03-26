'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Defines the schema for the **Key/Value Pairs**
// in the customer ALM system
var keyvaluepairSchema = new Schema({
  created_date: {
    type: Date,
    default: Date.now
  },
  updated_date: {
    type: Date,
    default: Date.now
  },
  token_name: {
    type: String,
    required: 'Please enter the name for the Key Value Pair'
  },
  value: {
    type: String
  }  
})
keyvaluepairSchema.virtual('keyvaluepair_id').get(function(){
  return this._id;
});
module.exports = mongoose.model('Keyvaluepair', keyvaluepairSchema);
