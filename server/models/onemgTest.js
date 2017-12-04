// models/onemgTest.js

var mongoose = require("mongoose");

var schema = mongoose.Schema(
  {
    id: { $type: Number, index: true },
    name: String,
    abbreviation: String,
    available: Boolean,
    category: String,
    sub_name: String,
    type: String,
    prescriptionId: String
  },
  { typeKey: "$type" }
);

module.exports = mongoose.model("OnemgTest", schema);
