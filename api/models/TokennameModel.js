'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Defines the schema for the **Features**
// in the customer ALM system
var tokennameSchema = new Schema({
  created_date: {
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
  }   
})
tokennameSchema.virtual('tokenname_id').get(function(){
  return this._id;
});
module.exports = mongoose.model('Tokenname', tokennameSchema);
