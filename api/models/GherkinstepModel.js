'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Defines the schema for the **Gherkin Steps**
// in the customer ALM system
var gherkinstepSchema = new Schema({
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
  alm_id: {
    type: String,
    required: 'Please enter the id for the Scenario from the ALM system'
  },
  transaction: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Transaction'
  },
  name: {
    type: String,
    required: 'Please enter the name of the Gherkin Step'
  },
  index: {
    type: Number,
    required: 'Please enter the index of the Gherkin Step'
  },
  gherkin_keyword: {
    type: String,
    enum: ['GIVEN', 'WHEN', 'THEN', 'AND', 'BUT'],
    required: 'Please enter a valid gherkin keyword of the Gherkin Step'
  }
})
gherkinstepSchema.virtual('gherkinstep_id').get(function(){
  return this._id;
});
module.exports = mongoose.model('Gherkinstep', gherkinstepSchema);
