// models/onemgDrug.js

var mongoose = require("mongoose");

var schema = mongoose.Schema({
  pName: String,
  packSize: String,
  packForm: String,
  id: { type: Number, index: true },
  name: String,
  hkpDrugCode: Number,
  manufacturer: String,
  therapeuticClassName: String,
  form: String,
  url: String,
  frequency: String,
  specialComments: String,
  duration: String,
  dosage: String,
  prescriptionId: String
});

module.exports = mongoose.model("OnemgDrug", schema);
