// models/drugInfo.js

var mongoose = require("mongoose");

var schema = mongoose.Schema({
  id: { type: Number, index: true },
  // onemg stuff
  name: String,
  manufacturer: String,
  therapeuticClassName: String,
  form: String,
  url: String,
  frequencies: [{ val: String, count: Number }],
  specialComments: [{ val: String, count: Number }],
  durations: [{ val: String, count: Number }],
  dosages: [{ val: String, count: Number }],
  // druginfo stuff
  composition: [String],
  substitutes: [String],
  used_for: [String],
  feedback: [
    {
      title: String,
      content: [[String]]
    }
  ],
  count: Number // frequency of this drug; should sort by this to serve most used drugs
});

module.exports = mongoose.model("Drug", schema);
