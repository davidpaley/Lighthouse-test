const fs = require("fs");
const lighthouse = require("lighthouse");
const chromeLauncher = require("chrome-launcher");
const constants = require("./constants");



(async () => {
  const [, , url, numberOfRuns = 10, formFactor = "mobile"] = process.argv
  if (!url) {
    console.log('Please define a correct URL')
  }
  const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] });

  const options = {
    logLevel: "info",
    output: "json",
    onlyCategories: ["performance"],
    port: chrome.port,
    extends: "lighthouse:default",
    settings:
      formFactor === "mobile"
        ? {
            formFactor,
            onlyAudits: [
              "first-contentful-paint",
              "speed-index",
              "largest-contentful-paint",
              "total-blocking-time",
              "interactive",
              "cumulative-layout-shift",
            ],
          }
        : {
            formFactor: "desktop",
            throttling: constants.throttling.desktopDense4G,
            screenEmulation: constants.screenEmulationMetrics.desktop,
            emulatedUserAgent: constants.userAgents.desktop,
          },
  };
  let fcp = 0;
  let si = 0;
  let lcp = 0;
  let tbt = 0;
  let interactive = 0;
  let cumulativeLayoutShift = 0;
  let score = 0;

  for (let i = 0; i < numberOfRuns; i++) {
    const runnerResult = await lighthouse(
      url,
      options
    );
    fcp += runnerResult.lhr.audits["first-contentful-paint"].numericValue;
    si += runnerResult.lhr.audits["speed-index"].numericValue;
    lcp += runnerResult.lhr.audits["largest-contentful-paint"].numericValue;
    tbt += runnerResult.lhr.audits["total-blocking-time"].numericValue;
    interactive += runnerResult.lhr.audits["interactive"].numericValue;
    cumulativeLayoutShift +=
      runnerResult.lhr.audits["cumulative-layout-shift"].numericValue;
    console.log({
      completed: `================ ${(((i + 1) / numberOfRuns) * 100).toFixed(
        2
      )} %==============================`,
      score: `================ ${(
        runnerResult.lhr.categories.performance.score * 100
      ).toFixed(4)} ===========================`,
    });
    score = score + runnerResult.lhr.categories.performance.score * 100;
  }

  fcp = (fcp / numberOfRuns).toFixed(2);
  si = (si / numberOfRuns).toFixed(2);
  lcp = (lcp / numberOfRuns).toFixed(2);
  tbt = (tbt / numberOfRuns).toFixed(2);
  interactive = (interactive / numberOfRuns).toFixed(2);
  cumulativeLayoutShift = (cumulativeLayoutShift / numberOfRuns).toFixed(2);
  score = (score / numberOfRuns).toFixed(2);
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
