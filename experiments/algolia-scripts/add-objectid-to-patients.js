var jsonfile = require("jsonfile");
var file =
  "/home/arpit/random/dranurag-data-entry-helper/datadumps/patients-30-11-2017-algolia-format.json";
var outfile =
  "/home/arpit/random/dranurag-data-entry-helper/datadumps/patients-30-11-2017-algolia-format-with-objectID.json";
obj = jsonfile.readFileSync(file);

jsonfile.writeFileSync(
  outfile,
  obj.map(patient => ({ ...patient, objectID: patient._id })),
  function(err) {
    console.log(err);
  }
);
