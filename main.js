const fs = require("fs");
const lighthouse = require("lighthouse");
const chromeLauncher = require("chrome-launcher");

(async () => {
  const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] });
  const options = {
    logLevel: "info",
    output: "json",
    onlyCategories: ["performance"],
    formFactor: "mobile",
    port: chrome.port,
    extends: "lighthouse:default",
    settings: {
      onlyAudits: [
        "first-contentful-paint",
        "speed-index",
        "largest-contentful-paint",
        "total-blocking-time",
        "interactive",
      ],
    },
  };

  const fcpArr = [];
  const siArr = [];
  const lcpArr = [];
  const tbtArr = [];
  const iArr = [];

  let fcp = 0;
  let si = 0;
  let lcp = 0;
  let tbt = 0;
  let interactive = 0;
  let score = 0;

  const number_of_runs = 5;
  for (let i = 0; i < number_of_runs; i++) {
    const runnerResult = await lighthouse(
      "http://web-main-git-cfc-11911-improve-browse-mobile-list-4af713.vercel.app/browse/bedroom/beds",
      options
    );

    // `.report` is the HTML report as a string
    // const reportHtml = runnerResult.report;
    // fs.writeFileSync("lhreport.json", reportHtml);
    console.log({
      fcp: runnerResult.lhr.audits["first-contentful-paint"].numericValue,
      domSize: runnerResult.lhr.audits["dom-size"].numericValue,
    });
    fcpArr.push(runnerResult.lhr.audits["first-contentful-paint"].numericValue);
    siArr.push(runnerResult.lhr.audits["speed-index"].numericValue);
    lcpArr.push(
      runnerResult.lhr.audits["largest-contentful-paint"].numericValue
    );
    tbtArr.push(runnerResult.lhr.audits["total-blocking-time"].numericValue);
    iArr.push(runnerResult.lhr.audits["interactive"].numericValue);

    fcp = fcp + runnerResult.lhr.audits["first-contentful-paint"].numericValue;
    si = si + runnerResult.lhr.audits["speed-index"].numericValue;
    lcp =
      lcp + runnerResult.lhr.audits["largest-contentful-paint"].numericValue;
    tbt = tbt + runnerResult.lhr.audits["total-blocking-time"].numericValue;
    interactive =
      interactive + runnerResult.lhr.audits["interactive"].numericValue;
    score = score + runnerResult.lhr.categories.performance.score * 100;
  }

  fcp = fcp / number_of_runs;
  si = si / number_of_runs;
  lcp = lcp / number_of_runs;
  tbt = tbt / number_of_runs;
  interactive = interactive / number_of_runs;
  score = score / number_of_runs;

  // `.lhr` is the Lighthouse Result as a JS object
  // console.log("Report is done for", runnerResult.lhr.finalUrl);
  console.log(
    "Performance score was",
    score
    // runnerResult.lhr.categories.performance.score * 100
  );
  console.log({
    fcp,
    si,
    lcp,
    tbt,
    interactive,
    score,
  });

  await chrome.kill();
})();
