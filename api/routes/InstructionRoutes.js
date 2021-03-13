'use strict';
module.exports = function(app) {
  var Instruction = require('../controllers/InstructionController');

  // TSDM Routes
  // Instructions
  app.route('/instruction')
    .get(Instruction.list_all_instructions)
    .post(Instruction.create_an_instruction);
};