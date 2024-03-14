/**
 * @file scraper.js
 * @brief letterboxd.com film reviews dataset curator
 * @author luethan2025
 * @release 2024
 */
const puppeteer = require('puppeteer-extra');
const { DEFAULT_INTERCEPT_RESOLUTION_PRIORITY } = require('puppeteer');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
puppeteer.use(
  AdblockerPlugin({
    // optionally enable Cooperative Mode for several request interceptors
    interceptResolutionPriority: DEFAULT_INTERCEPT_RESOLUTION_PRIORITY
  })
);
const { Command, Option } = require('commander');
const { getReasonPhrase } = require('http-status-codes');
const { BadConnectionError } = require('./lib/error');
const { searchForReviews } = require('./common_utils');

/** Main routine */
(async () => {
  const program = new Command();
  program.name('scraper').description('').version('0.0.1');

  program
    .option('--append <boolean>', 'append to destination file', false)
    .addOption(new Option('--url <string>', 'URL to film on letterboxd.com'))
    .addOption(
      new Option('--directory <string>', 'destination directory').default(
        './data/'
      )
    )
    .addOption(
      new Option('--filename <string>', 'destination file').default(
        'reviews.txt'
      )
    );

  program.parse(process.argv);

  const options = program.opts();
  const { append, url, directory, filename } = options;

  const browser = await puppeteer.launch({
    defaultViewport: {
      width: 1366,
      height: 768
    },
    headless: true
  });

  const page = await browser.newPage();

  console.log(`Navigating to ${url}`);
  const response = await page.goto(url, {
    waitUntil: 'networkidle2'
  });

  const status = response.status();
  if (status !== 200) {
    console.log('Connection was unsucessful. Try again at another time.');
    throw new BadConnectionError(
      `Status expected HTTP ${200} ${getReasonPhrase(200)}, ` +
        `but was HTTP ${status} ${getReasonPhrase(status)}`
    );
  }
  console.log('Connection was sucessful\n');
  await searchForReviews(page, url, directory, filename, append);

  await browser.close();
})();
