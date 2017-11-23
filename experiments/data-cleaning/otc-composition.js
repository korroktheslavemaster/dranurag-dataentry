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

var request = require("request-promise-native");

var xpath = require("xpath"),
  dom = require("xmldom").DOMParser;

// tabletwise
tabletwise = () =>
  OnemgDrug.find({ url: /^\/otc/ })
    .distinct("name")
    .then(names => {
      console.log(names);
      names.map(name => {
        request
          .get("https://www.tabletwise.com/s/ajax_results?q=" + name)
          .then(htmlString => {
            products = JSON.parse(htmlString).results.products_list;
            var doc = new dom({
              errorHandler: {
                warning: () => {},
                error: () => {}
              }
            }).parseFromString(products);
            // console.log(products);
            links = xpath.select("li/a/@href", doc).map(node => node.value);
            console.log({ name: name, links: links });
          });
      });
    });

// otc drugs:
drugs = [
  { _id: 151208, name: "D-Rise 60K" },
  { _id: 328590, name: "Nefrosave Tablet" },
  { _id: 324939, name: "Benadon Tablet" },
  { _id: 71072, name: "Orofer XT Tablet" },
  { _id: 138818, name: "Volini Gel" },
  { _id: 70249, name: "Feronia-XT Tablet" },
  { _id: 61706, name: "Gasex Tablet" },
  { _id: 121943, name: "Econorm 250mg Capsule" },
  { _id: 328664, name: "Mgd3  Tablet" },
  { _id: 67577, name: "Uprise-D3 60K Capsule" },
  { _id: 160457, name: "Lupi D3 60000IU Tablet" },
  { _id: 111246, name: "Calcirol  Sachet" },
  { _id: 111998, name: "Zincovit Tablet" },
  { _id: 338418, name: "Lumia 60K Capsule" },
  { _id: 188384, name: "Nurokind OD Tablet" },
  { _id: 66696, name: "Supracal Tablet" },
  { _id: 64899, name: "Homochek Capsule" },
  { _id: 323191, name: "Arachitol Nano Oral Solution 5ml" },
  { _id: 150422, name: "Gemcal Capsule" },
  { _id: 63731, name: "Ccm Tablet" },
  { _id: 64445, name: "Fefol -Z Capsule" },
  { _id: 165686, name: "Bevon Capsule" },
  // { "_id" : 114283, "name" : "Vsl 3 Vegicap" },
  { _id: 63008, name: "A to Z NS Tablet" },
  { _id: 138032, name: "Folvite 5mg Tablet" },
  { _id: 135972, name: "Absolut 3G Capsule" },
  { _id: 324768, name: "Gelusil Mps" }
];

// medplusmart
medplusmart = () => {
  console.log(drugs);
  promises = drugs.map(({ _id, name }) => {
    var headers = {
      Pragma: "no-cache",
      "Accept-Encoding": "text/json",
      "Accept-Language": "en-US,hi-IN;q=0.8,hi;q=0.6,en;q=0.4",
      "Upgrade-Insecure-Requests": "1",
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.78 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      Cookie:
        'state=TELANGANA; intermediateWareHouse=; currentCity=HYDERABAD; warehouse=INAPHYD00384; currentHub=INTGHYD00467; pincode=500042; area=; versionNo=36243; localityId=8108; hlocality=BALA NAGAR; subLocality=; latLong=17.4603401,78.4529809; cartD=; cartProductIdString={}; isCityChanged=true; hub=INTGHYD00467; defaultLocality=N; ROUTEID=.jvm6; __stp={"visit":"new","uuid":"ef4265da-0d93-4655-85b2-f99bed564cad"}; __sts={"sid":1510987881076,"tx":1510988031387,"url":"https://www.medplusmart.com/product/BENADON-40MG-TABLET/BENA0004","pet":1510988031387,"set":1510987881076,"pUrl":"https://www.medplusmart.com/product/MGD3-TABLET/MGD30001","pPet":1510987881076,"pTx":1510987881076}; JSESSIONID=B912BC4AF2257CBCE024D9EE12292F68'
    };

    var options = {
      url:
        "https://www.medplusmart.com/ProductSearchAll.mart?n=" +
        new Buffer(name).toString("base64") +
        "&productType=A&rows=100",
      headers: headers
    };

    return request
      .get(options)
      .then(htmlString => {
        // console.log(htmlString);
        products = JSON.parse(htmlString);
        if (products.length) {
          first = products[0];
          composition = first.compositionName.split("+");
          return new DrugInfo({
            id: _id,
            composition: composition
          })
            .save()
            .then(doc => {
              console.log(doc);
              return doc;
            });
        }
      })
      .catch(err => {
        console.log({ name: name, err: 404 });
      });
  });
  Promise.all(promises).then(docs => console.log("done."));
};

deleteDrugInfo = () => {
  Promise.all([
    drugs.map(({ _id, name }) => {
      return DrugInfo.findOneAndRemove({ id: _id })
        .exec()
        .then(doc => console.log(doc));
    })
  ]).then(() => console.log("done"));
};

// deleteDrugInfo();
medplusmart();
