#!/bin/sh
echo "rm -r node_modules/"
rm -r node_modules/

echo "rm package-lock.json"
rm package-lock.json

npm install
brew uninstall chromium
brew install chromium --no-quarantine

echo "const { join } = require('path');

/**
 * @type { import("puppeteer").Configuration }
 */
module.exports = {
  // changes the cache location for Puppeteer
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
  // defines which Chromium executable to run
  executablePath: '$(which chromium)',
};" > .puppeteerrc.js
