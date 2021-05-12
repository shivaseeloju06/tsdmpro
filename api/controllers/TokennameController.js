'use strict';
const JsonFind = require("json-find");
var mongoose = require('mongoose'),
  Dataiteration = mongoose.model('Dataiteration'),
  Keyvaluepair = mongoose.model('Keyvaluepair'),
  Tokenname = mongoose.model('Tokenname');

exports.list_all_tokennames = function (req, res) {
  Tokenname.find({})
    .exec(function (err, tokenname) {
      if (err) {
        res.send(err);
        console.log(err);
        return;
      }
      res.json(tokenname);
  });
}

exports.read_a_tokenname_by_id = function (req, res) {
  Tokenname.findById(req.params.id, function (err, tokenname) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    }
    res.json(tokenname);
  });
}

exports.update_a_tokenname_by_id = function (req, res) {
  // TODO cascade through data iterations
  Tokenname.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, function (err, tokenname) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    }
    res.json(tokenname);
  });
}

exports.delete_a_tokenname_by_id = function (req, res) {
  // TODO no deletion for now
  Tokenname.remove({ _id: req.params.id }, function (err, tokenname) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    }
    res.json({ message: 'Tokenname successfully deleted' });
  });
}

exports.list_all_tokennames_by_wildcard = function (req, res) {
  Tokenname.find({name: {$regex: req.params.tokenname,$options:'i'}})
  .exec(function (err, result){
      if (err) {
        res.send(err);
        console.log(err);
        return;
      }
      res.json(result);
    });
}

exports.create_a_tokenname = async function (req, res) {
  var new_tokenname = new Tokenname(req.body);
  new_tokenname.save(function (err, tokenname) {
    if (err) {
      res.send(err);
      console.log(err);
      return;
    }
    addTokenToAllDataiterations(tokenname.name);
    res.json(tokenname);
  });
}


// TODO move business logic into seperate controller

async function addTokenToAllDataiterations(name) {
  Dataiteration.find({}, async function (err, iterations) {
    iterations.forEach(async function (element) {
      var new_keyvaluepair = new Keyvaluepair({"token_name": name, "value": ""});
      new_keyvaluepair.save(function (err, keyvaluepair) {
        if (err) {
          console.log(err);
          return err
        }
        Dataiteration.findByIdAndUpdate({ _id: element._id }, {$push: {keyvaluepairs: keyvaluepair._id}},
          function(err, result) {
            if (err) {
              console.log(err);
            }
            //console.log(result);
        });
      });
    });
  });
  return;
}
