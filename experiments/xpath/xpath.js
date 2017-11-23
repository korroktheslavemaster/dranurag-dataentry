var xpath = require("xpath"),
  dom = require("xmldom").DOMParser,
  serializer = require("xmldom").XMLSerializer;
serializer = new serializer();
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
var requestUncached = require("request"),
  cachedRequest = require("cached-request")(requestUncached),
  cacheDirectory = "/tmp/cache";

cachedRequest.setValue("ttl", 0);
cachedRequest.setCacheDirectory(cacheDirectory);
var request = cachedRequest;

var jsonfile = require("jsonfile");
var file = "experiments/xpath/selectors.json";
selectors = jsonfile.readFileSync(file);

getDrugInfo = (url, id) => {
  var options = {
    type: "GET",
    url: "https://www.1mg.com" + url,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 920)"
    }
  };
  return new Promise((resolve, reject) => {
    request(options, (err, response, htmlString) => {
      if (err) reject(err);
      if (htmlString instanceof Buffer) htmlString = htmlString.toString();
      var doc = new dom({
        errorHandler: {
          warning: () => {},
          error: () => {}
        }
      }).parseFromString(htmlString);
      data = {
        composition: xpath
          .select(selectors["composition"], doc)
          .map(elm => elm.firstChild.data),
        substitutes: xpath
          .select(selectors["substitutes"], doc)
          .map(elm => elm.firstChild.data),
        used_for: xpath
          .select(selectors["used_for"], doc)
          .map(elm => elm.firstChild.data),
        feedback: xpath
          .select(selectors["feedback_container"], doc)
          .map(elm => {
            title = xpath.select("span", elm).map(elm => elm.textContent);
            if (title.length) title = title[0];
            else title = "";
            content_keys = xpath
              .select(
                "div[@class='row']/div/div[@class='row']/div[@class='col-xs-4 FeedbackBar__details-text___AoQKo']",
                elm
              )
              .map(elm => elm.textContent);
            content_values = xpath
              .select(
                "div[@class='row']/div/div[@class='row']/div[@class='col-xs-8']/div[@class='row FeedbackBar__bar-value___3WBjT']/div[@class='col-xs-1 FeedbackBar__percentage___3jN1a']",
                elm
              )
              .map(elm => elm.textContent);
            return {
              title: title,
              content: _.unzip([content_keys, content_values])
            };
          })
      };
      resolve({ ...data, id: id });
    });
  });
};

testUrl = "/drugs/losar-50mg-tablet-74731";
testId = 0;
// getDrugInfo(testUrl, testId)
//   .then(x => console.log(util.inspect(x, false, null)))
//   .catch(e => console.log(e));

count = 0;
invalids = [];
runOn = [
  338418
  // 12155,
  // 328210,
  // 72951,
  // 165189,
  // 33989,
  // 343042,
  // 345379,
  // 328324,
  // 192268,
  // 122170,
  // 351840,
  // 40575,
  // 323191,
  // 66681,
  // 149311,
  // 239107,
  // 64139,
  // 325616,
  // 65449,
  // 151208,
  // 166089,
  // 325414,
  // 328590,
  // 74819,
  // 27774,
  // 117706,
  // 29973,
  // 220844,
  // 148699,
  // 335809,
  // 212551,
  // 69077,
  // 261736,
  // 134937,
  // 317274,
  // 16508,
  // 16505,
  // 156977,
  // 268603,
  // 70249,
  // 351570,
  // 340801,
  // 38618,
  // 272477,
  // 150422,
  // 63008,
  // 343034,
  // 134440,
  // 160457,
  // 9172,
  // 358350,
  // 70955,
  // 144953
];
run = () => {
  Promise.all([
    OnemgDrug.find({ url: { $regex: /^\/drug/ } }).then(docs =>
      _.uniqBy(docs, doc => doc.id)
    ),
    DrugInfo.find().then(docs => docs.map(doc => doc.id))
  ])
    .then(([onemgdrugs, doneIds]) =>
      onemgdrugs.filter(doc => doneIds.indexOf(doc.id) == -1)
    )
    .then(docs => {
      console.log(docs.length);
      return docs;
    })
    // .then(docs => docs.filter(doc => runOn.indexOf(doc.id) != -1))
    .then(docs => {
      promises = docs.map(doc => {
        return getDrugInfo(doc.url, doc.id)
          .then(info => {
            count += 1;
            console.log(info);
            console.log(count);
            return new DrugInfo(info).save();
          })
          .catch(err => {
            invalids.push(doc.id);
          });
      });
      Promise.all(promises).then(docs => {
        console.log("done");
        console.log("invalids: " + invalids);
      });
    });
};

run();
