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
        "cumulative-layout-shift",
      ],
    },
  };
  let fcp = 0;
  let si = 0;
  let lcp = 0;
  let tbt = 0;
  let interactive = 0;
  let cumulativeLayoutShift = 0;
  let score = 0;

  const number_of_runs = 1;
  for (let i = 0; i < number_of_runs; i++) {
    const runnerResult = await lighthouse(
      "https://web-main-bfnh7zbhp-city-furniture.vercel.app/product/9719211/hilton-two-tone-96-table-4-skirted-chairs",
      options
    );
    fcp = fcp + runnerResult.lhr.audits["first-contentful-paint"].numericValue;
    si = si + runnerResult.lhr.audits["speed-index"].numericValue;
    lcp =
      lcp + runnerResult.lhr.audits["largest-contentful-paint"].numericValue;
    tbt = tbt + runnerResult.lhr.audits["total-blocking-time"].numericValue;
    interactive =
      interactive + runnerResult.lhr.audits["interactive"].numericValue;
    cumulativeLayoutShift =
      cumulativeLayoutShift +
      runnerResult.lhr.audits["cumulative-layout-shift"].numericValue;
    console.log({
      score: `=================${
        runnerResult.lhr.categories.performance.score * 100
      }==============================`,
    });
    score = score + runnerResult.lhr.categories.performance.score * 100;
  }

  fcp = fcp / number_of_runs;
  si = si / number_of_runs;
  lcp = lcp / number_of_runs;
  tbt = tbt / number_of_runs;
  interactive = interactive / number_of_runs;
  cumulativeLayoutShift = cumulativeLayoutShift / number_of_runs;
  score = score / number_of_runs;
  // `.lhr` is the Lighthouse Result as a JS object
  // console.log("Report is done for", runnerResult.lhr.finalUrl);
  console.log({
    fcp,
    si,
    lcp,
    tbt,
    interactive,
    cumulativeLayoutShift,
    score,
  });

  await chrome.kill();
})();
