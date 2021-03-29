'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Defines the schema for the **Keywords**
// in the customer ALM system
var instructionSchema = new Schema({
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
  library: {
    type: String,
    required: 'Please enter the library for the Instruction'
  },
  name: {
    type: String,
    required: 'Please enter the name of the Instruction'
  },
  arguments: [
    {
      argument: {type: String},
      required: {
        type: Boolean,
        default: true
      }
    }
  ]
})
instructionSchema.index({'library': 1, 'name': 1}, {unique: true});
instructionSchema.virtual('instruction_id').get(function(){
  return this._id;
});
module.exports = mongoose.model('Instruction', instructionSchema);
