/**
 * @file error.js
 * @brief Collection of Error Object used by scraper.js
 * @author luethan2025
 * @release 2024
 */
class BadConnectionError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { BadConnectionError };
