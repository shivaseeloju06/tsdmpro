'use strict';
const JsonFind = require("json-find");
var mongoose = require('mongoose'),
  Instruction = mongoose.model('Instruction');

exports.list_all_instructions = function (req, res) {
  Instruction.find({})
    .exec(function (err, instruction) {
      if (err) {
        res.send(err);
        console.log(err);
        return;
      }
      res.json(instruction);
    });
}

exports.create_an_instruction = function (req, res) {
  var new_instruction = new Instruction(req.body);
  new_instruction.save(function (err, instruction) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    }
    res.json(instruction);
  });
}

exports.read_instruction_by_id = function (req, res) {
  Instruction.findById(req.params.id, function (err, action) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    }
    res.json(action);
  });
}