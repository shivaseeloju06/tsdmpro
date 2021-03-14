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
  },
  expected_result: {
    type: String,
    required: 'Please enter an expected result',
    enum: ['PASS', 'FAIL'],
  },
  instruction: {
    type: String,
    required: 'Please enter an Instruction'
  },
  test_data:[
    {
      iteration: {
          type: Number,
          required: 'please enter an iteration number'
      },
      environments: [
        {
          environment: [
            {
              environment: {
                type: String,
                required: 'Please enter an environment'
              },
              datapairs: [
                {
                  argument: {
                    type: String,
                    required: 'please enter an argument'
                  },
                  valuename: {
                    type: String,
                  }
                }
              ]
            }        
         ]
        }
      ]
    }
  ]
})
actionSchema.virtual('action_id').get(function(){
  return this._id;
});
module.exports = mongoose.model('Action', actionSchema);
