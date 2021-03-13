'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Defines the schema for the **Features**
// in the customer ALM system
var actionSchema = new Schema({
  created_date: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
  }
})
actionSchema.virtual('action_id').get(function(){
  return this._id;
});
module.exports = mongoose.model('Action', actionSchema);
