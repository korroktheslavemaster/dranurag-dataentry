// models/drugInfo.js

var mongoose = require("mongoose");

var schema = mongoose.Schema({
  id: { type: Number, index: true },
  composition: [String],
  substitutes: [String],
  used_for: [String],
  feedback: [
    {
      title: String,
      content: [[String]]
    }
  ]
});

module.exports = mongoose.model("DrugInfo", schema);
