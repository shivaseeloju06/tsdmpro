'use strict';
var mongoose = require('mongoose');
const StepsModel = require('./StepcollectionModel');
var Schema = mongoose.Schema;

// Defines the schema for the **Features**
// in the customer ALM system
var stepactionsSchema = new Schema({
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
    required: 'Please enter the name for the Step Action',
    unique: true
  },
  wip_step_collection: [
    {
      index: {
        type: Number,
        required: 'Please enter a sequence index number',
        unique: true
      },
      action: ActionSchema
    }
  ],
  published_step_collection: [
    {
      index: {
        type: Number,
        required: 'Please enter a sequence index number',
        unique: true
      },
      action: ActionSchema
    }
  ]
})
stepactionsSchema.virtual('stepaction_id').get(function(){
  return this._id;
});
module.exports = mongoose.model('Stepactions', stepactionsSchema);
