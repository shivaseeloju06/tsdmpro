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
  updated_date: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
  },
  expected_result: {
    type: String,
    required: 'Please enter an expected result',
    enum: ['PASS', 'FAIL'],
  },
  instruction: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Instruction'
  },
  argument_datatoken_pairs: [
    {
      argument: {
        type: String,
        required: 'please enter an argument'
      },
      token_name: {
        type: String
      }
    }
  ]

})
actionSchema.virtual('action_id').get(function(){
  return this._id;
});
module.exports = mongoose.model('Action', actionSchema);
