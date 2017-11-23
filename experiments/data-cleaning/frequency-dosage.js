var _ = require("lodash");
const util = require("util");

var mongoose = require("mongoose");
// configuration ===============================================================
var connection = mongoose.connect("mongodb://localhost/dataentry"); // connect to our database
// use js promise
mongoose.Promise = global.Promise;
var autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(connection);

var OnemgDrug = require("../../server/models/onemgDrug");
var DrugInfo = require("../../server/models/drugInfo");

// fill out dosage
// run = () => {
//   OnemgDrug.find()
//   .then(docs => {
//     docs.forEach(doc => {
//       frequencies = doc.frequency.split(',')
//     })
//   })
// }

// see what's wrong with DrugInfo?
// distinct drugs = 206, otc = 27
// druginfos = 191?
let difference = (a, b) => new Set([...a].filter(x => !b.has(x)));
Promise.all([
  OnemgDrug.distinct("id"),
  DrugInfo.distinct("id")
]).then(([onemgs, druginfos]) => {
  console.log(druginfos.length);
  s1 = new Set(onemgs);
  s2 = new Set(druginfos);
  console.log(difference(s1, s2));
  console.log(difference(s2, s1));
});
