
/*const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    get: (key, fallback) => {
      if (process.env[key]) return process.env[key];
      return fallback;
    }
  };

  */

const dotenv = require('dotenv');
const path = require('path');

const envName = process.env.ENV || 'local';  // default local
dotenv.config({ path: path.resolve(__dirname, `.env.${envName}`) });

module.exports = {
  get: (key, fallback) => process.env[key] || fallback
};