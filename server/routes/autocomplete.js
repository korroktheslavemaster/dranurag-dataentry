// autocomplete/typeahead endpoints

require("dnscache")({ enable: true });
var jsonfile = require("jsonfile");
var request = require("request");
var _ = require("lodash");
var OnemgDrug = require("../models/onemgDrug");
var Prescription = require("../models/prescription");

module.exports = app => {
  var startTime = new Date().getTime();
  app.get("/autocomplete/onemg", function(req, res) {
    var ts = Math.round((new Date().getTime() - startTime) / 1000);
    var headers = {
      "Accept-Encoding": "gzip, deflate, sdch, br",
      "Accept-Language": "en-US,en;q=0.8,en-GB;q=0.6",
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      Accept: "application/json, text/javascript, */*; q=0.01",
      Referer: "https://www.1mg.com/",
      "X-Requested-With": "XMLHttpRequest",
      Connection: "keep-alive",
      Cookie:
        "VISITOR-ID=00f852a3-7bcb-436f-c357-7e7e99268863_acce55_1498552587; city=New%20Delhi; session=qpkejpeTRxzg-pYfaY1KVg.nqNBwCsos-NuWuKbcQkPiX20AKGFrZ2kjWRnQwZUKSrlchYu_HBSrjV1WcR5EiaOC_L4VMjgneeeSch8bR60_mdnRGDVGTFjZRXGn2rZBJCc7L0fYSMr0NKP-B-hNnLp.1498897149119.2592000000.EiBqLKNC-urBNLW-67Jipmu8PWKsRJHK-mV6JCkXkJw; nv_push_error=201; ldo_q=dg; _csrf=LctShJYaDT2vlNMRbGPNXXmH; _ga=GA1.1.1562643785.1498552590; _gid=GA1.1.747211440.1499103590; pv=1; shw_7087=1; nv_li_9433=1; shw_9433=1; _ga=GA1.2.1562643785.1498552590; _gid=GA1.2.747211440.1499103590; shw_x_9433=1; WZRK_G=2f9c2294754f446595c8d316273c9b3c; geolocation=false; ts=" +
        ts
    };

    var options = {
      url:
        "https://www.1mg.com/api/v1/search/autocomplete?city=New%20Delhi&pageSize=20&name=" +
        req.query.q,
      headers: headers,
      gzip: true,
      time: true,
      forever: true
    };
    request.get(options, (err, response, body) => {
      // console.log(response.timingPhases);
      result = JSON.parse(body).result;
      res.json(_.filter(result, elm => elm.pName));
    });
  });

  // healthos endpoint for drug
  app.get("/autocomplete/healthos", function(req, res) {
    var headers = {
      Authorization:
        "Bearer 55ad7d70367adad2c453aa02de5814898735f8addaa1b11b5e6c18f7c084f573"
    };
    var options = {
      headers: headers,
      url:
        "https://www.healthos.co/api/v1/autocomplete/medicines/brands/" +
        req.query.q,
      time: true,
      forever: true
    };
    request.get(options, (err, response, body) => {
      // console.log(body)
      // console.log(response.timingPhases);
      // console.log(body);
      // console.log(response)
      res.json(JSON.parse(body));
    });
  });

  app.post("/addDrugs", (req, res) => {
    const { docs, prescriptionId } = req.body;
    promises = docs.map(doc => {
      return new OnemgDrug({ ...doc, prescriptionId: prescriptionId }).save();
    });
    Promise.all(promises)
      .then(docs => {
        // save the prescription
        return new Prescription({ drugs: docs.map(drug => drug._id) }).save();
      })
      .then(all => res.send("OK"))
      .catch(e => {
        console.log(e);
        res.send("NOTOK");
      });
  });
};
