'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Defines the schema for the **Features**
// in the customer ALM system
var stepactionSchema = new Schema({
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
        unique: true
      },
      action: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Action',
      }
    }
  ],
  published_step_collection: [
    {
      index: {
        type: Number,
        unique: true
      },
      action: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Action',
      }
    }
  ]
})
stepactionSchema.virtual('stepaction_id').get(function(){
  return this._id;
});
module.exports = mongoose.model('Stepaction', stepactionSchema);
