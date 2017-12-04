// autocomplete/typeahead endpoints

require("dnscache")({ enable: true });
var jsonfile = require("jsonfile");
var request = require("request");
var _ = require("lodash");
var OnemgDrug = require("../models/onemgDrug");
var OnemgTest = require("../models/onemgTest");
var Prescription = require("../models/prescription");

module.exports = app => {
  var startTime = new Date().getTime();
  app.get("/autocomplete/onemgDrugs", function(req, res) {
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

  app.get("/autocomplete/onemgTests", (req, res) => {
    var headers = {
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "en-US,hi-IN;q=0.8,hi;q=0.6,en;q=0.4",
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.78 Safari/537.36",
      Accept: "application/json, text/plain, */*",
      Referer: "https://www.1mg.com/labs/new-delhi",
      Connection: "keep-alive",
      Cookie:
        "VISITOR-ID=6519653a-e3fd-40fb-c093-231ce7ab097f_acce55_1509100128; __uzma=11f0bdef-cf05-47f7-8042-a81341b77a50; __uzmb=1510833558; session=eunBEvAHA8L4_E3JwZh8xw.O10gdznimPlXZ6129LZdoukruBUPI2s5T__F1cWWfhAVfiboAYz8DJSTKwQ-6RuOYYlnqBzUZUY1NpL7pyI5Csj60X6IHCJuNR_1BQcs8YSsGded5Q9JmS5EONBoeFweTGjv3eQVlYUQhy5GtDxPXrpiQB1kD26j4-JyaWd9VEPddNHCpm3FdJ75p8OPEwigVJHHaS7f-bVp68Yt8miPBBeH8KBezSZ2KlDwKLjVu5oDwaDz_vmbHPkZ1n0HaKe1.1512114795011.2592000000.pJbqlTMkvb9tgzICCp7_2eb5aVCzKUgZdtl5FodBLag; geolocation=true; _csrf=AGwWeJdp9MBT21BywcCKOrC6; city=new%20delhi; __uzmc=3386453233249; uzdbm_a=834f25bc-aa29-7dee-1b1a-4e8661db4463; __uzmd=1512369879"
    };

    var options = {
      url: `https://www.1mg.com/labs_api/v4/tests?page_number=0&page_size=10&city=new+delhi&search_text=${req
        .query.q}&remove_radiology=false&remove_unavailable=false`,
      headers: headers,
      gzip: true,
      time: true,
      forever: true
    };
    request.get(options, (err, response, body) => {
      // console.log(response.timingPhases);
      res.json(JSON.parse(body));
    });
  });

  app.post("/addTests", (req, res) => {
    const { docs, prescriptionId } = req.body;
    promises = docs.map(doc =>
      new OnemgTest({ ...doc, prescriptionId }).save()
    );
    Promise.all(promises)
      .then(docs => res.send("OK"))
      .catch(e => {
        console.log(e);
        res.send("NOTOK");
      });
  });
};
