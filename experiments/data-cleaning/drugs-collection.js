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
var Drug = require("../../server/models/drug");

var multiset = list => {
  ms = [];
  for (var idx in list) {
    var str = list[idx];
    var temp;
    if ((temp = _.find(ms, { val: str }))) {
      temp["count"] += 1;
    } else {
      ms.push({ val: str, count: 1 });
    }
  }
  return ms;
};

Promise.all([
  OnemgDrug.aggregate([
    {
      $group: {
        _id: "$id",
        name: { $first: "$name" },
        count: { $sum: 1 },
        frequencies: { $push: "$frequency" },
        dosages: { $push: "$dosage" },
        durations: { $push: "$duration" },
        specialComments: { $push: "$specialComments" }
      }
    }
  ]).exec(),
  DrugInfo.find()
    .exec()
    .then(infos => infos.map(info => info.toObject()))
]).then(([onemgdrugs, druginfos]) => {
  drugs = onemgdrugs.map(drug => {
    info = druginfos.find(info => drug._id === info.id);
    drug = { ...drug, ...info };
    var fields = ["frequencies", "dosages", "durations", "specialComments"];
    fields.forEach(str => (drug[str] = multiset(drug[str])));
    // remove __v and _id
    delete drug.__v;
    delete drug._id;
    return drug;
  });
  Promise.all(drugs.map(drug => new Drug(drug).save())).then(docs =>
    console.log("done")
  );
  console.log(util.inspect(drugs.slice(0, 10), false, null));
});
