/**
 * @file common_utils.js
 * @brief Collection of utility functions to abstract scraper.js
 * @author luethan2025
 * @release 2024
 */
const { existsSync, mkdirSync, writeFileSync } = require('fs');
const { join } = require('path');
const { BadConnectionError } = require('./lib/error');

/**
 * @brief Returns an Array of the reviews found on the current page
 * @param {Object} page Puppeteer page instance
 * @return {Array} Array of reviews found on the current page
 */
async function scrapeReviews(page) {
  const reviewsOnPage = await page.$x(
    '//div[contains(@class, "body-text -prose collapsible-text")]'
  );

  // decode selected tags
  const currentReviews = await Promise.all(
    reviewsOnPage.map(
      async (item) => await (await item.getProperty('innerText')).jsonValue()
    )
  );
  const reviews = currentReviews.map((review) =>
    review.replace(/\n/g, '').trim()
  );
  return reviews;
}

/**
 * Traverses file home page for film reviews
 * @param {Object} page Puppeteer page instance
 * @param {String} url Base film URL
 * @return {Array} Array of reviews
 */
async function collectReviews(page, url) {
  const reviews = [];
  let currentReviews = [null];

  let i = 1;
  while (currentReviews.length !== 0) {
    try {
      console.log(
        `Attempting to navigate to ${url}/reviews/by/added/page/${i}/`
      );
      const response = await page.goto(`${url}/reviews/by/added/page/${i}/`, {
        waitUntil: 'networkidle2'
      });

      const status = response.status();
      if (status !== 200) {
        console.log('Connection was unsucessful');
        throw new BadConnectionError(
          `Status expected HTTP ${200} ${getReasonPhrase(200)}, ` +
            `but was HTTP ${status} ${getReasonPhrase(status)}`
        );
      } else {
        console.log('Connection was sucessful\n');
        currentReviews = await scrapeReviews(page);
        reviews.push(...currentReviews);
      }
    } catch {
      console.log('Something went wrong. Skipping\n');
      continue;
    }
    i++;
  }
  return reviews;
}

/**
 * Writes the dataset into a file
 * @param {Object} reviews Scraped reviews
 * @param {String} directory Destination directory
 * @param {String} filePath Path to destination file
 * @param {boolean} append If true appends to a file, otherwise rewrite the
 *                         entire file
 */
function log_reviews(reviews, directory, filePath, append) {
  if (existsSync(directory) === false) {
    mkdirSync(directory, { recursive: true });
    console.log(`${directory} was created successfully`);
  } else {
    console.log(`${directory} was found`);
  }

  console.log(`Started writing data to ${filePath}`);
  if (append === true) {
    writeFileSync(filePath, reviews.join('\n'), { flag: 'a' });
  } else {
    writeFileSync(filePath, reviews.join('\n'), { flag: 'w' });
  }
  console.log('Finished writing data');
}

/**
 * Curator main routine
 * @param {Object} page Puppeteer page instance
 * @param {String} url Base  URL
 * @param {String} directory Destination directory
 * @param {String} filename Destination file
 * @param {boolean} append If true appends to a file, otherwise rewrite the
 *                         entire file
 */
async function searchForReviews(page, url, directory, filename, append) {
  const reviews = await collectReviews(page, url);

  const filePath = join(directory, filename);
  log_reviews(reviews, directory, filePath, append);
}

module.exports = { searchForReviews };
