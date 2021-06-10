const fs = require('fs')
const lighthouse = require('lighthouse')
const chromeLauncher = require('chrome-launcher')
const constants = require('./constants')

;(async () => {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] })
  const formFactor = 'mobile'
  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance'],
    port: chrome.port,
    extends: 'lighthouse:default',
    settings:
      formFactor === 'mobile'
        ? {
            formFactor,
            onlyAudits: [
              'first-contentful-paint',
              'speed-index',
              'largest-contentful-paint',
              'total-blocking-time',
              'interactive',
              'cumulative-layout-shift',
            ],
          }
        : {
            formFactor: 'desktop',
            throttling: constants.throttling.desktopDense4G,
            screenEmulation: constants.screenEmulationMetrics.desktop,
            emulatedUserAgent: constants.userAgents.desktop,
          },
  }
  let fcp = 0
  let si = 0
  let lcp = 0
  let tbt = 0
  let interactive = 0
  let cumulativeLayoutShift = 0
  let score = 0

  const number_of_runs = 3
  for (let i = 0; i < number_of_runs; i++) {
    const runnerResult = await lighthouse(
      'https://web-main-city-furniture.vercel.app/browse/dining-room',
      options
    )
    fcp = fcp + runnerResult.lhr.audits['first-contentful-paint'].numericValue
    si = si + runnerResult.lhr.audits['speed-index'].numericValue
    lcp = lcp + runnerResult.lhr.audits['largest-contentful-paint'].numericValue
    tbt = tbt + runnerResult.lhr.audits['total-blocking-time'].numericValue
    interactive =
      interactive + runnerResult.lhr.audits['interactive'].numericValue
    cumulativeLayoutShift =
      cumulativeLayoutShift +
      runnerResult.lhr.audits['cumulative-layout-shift'].numericValue
    console.log({
      completed: `================ ${(((i + 1) / number_of_runs) * 100).toFixed(
        2
      )} %==============================`,
      score: `================ ${(
        runnerResult.lhr.categories.performance.score * 100
      ).toFixed(4)} ===========================`,
    })
    score = score + runnerResult.lhr.categories.performance.score * 100
  }

  fcp = (fcp / number_of_runs).toFixed(4)
  si = (si / number_of_runs).toFixed(4)
  lcp = (lcp / number_of_runs).toFixed(4)
  tbt = (tbt / number_of_runs).toFixed(4)
  interactive = (interactive / number_of_runs).toFixed(4)
  cumulativeLayoutShift = (cumulativeLayoutShift / number_of_runs).toFixed(4)
  score = (score / number_of_runs).toFixed(4)
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
  })

  await chrome.kill()
})()
