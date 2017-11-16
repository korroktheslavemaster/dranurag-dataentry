// models/prescription.js

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = mongoose.Schema({
  drugs: [{ type: Schema.Types.ObjectId, ref: "OnemgDrug" }]
});

module.exports = mongoose.model("Prescription", schema);
