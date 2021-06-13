const config = require(`./${process.env.NODE_ENV}.config.js`);

module.exports = Object.assign(
  {
    PORT: Number(process.env.PORT) || 3000,
    SALT_ROUNDS: 6,
    host: `http://localhost:${Number(process.env.PORT) || 3000}`,
    COOLIE_SECRET: process.env.PORT || 'aaaa',
  },
  config,
);
