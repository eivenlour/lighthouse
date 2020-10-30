"use strict";

const dotenv = require("dotenv");
const ENV = process.env.NODE_ENV || "development";

if (ENV === "development") dotenv.load();

const config = {
  ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  PROXY_URI: process.env.PROXY_URI,
  WEBHOOK_URL: process.env.WEBHOOK_URL,
  LIGHTHOUSE_COMMAND_TOKEN: process.env.LIGHTHOUSE_COMMAND_TOKEN,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  S3_BUCKET: process.env.S3_BUCKET,
  REGION: process.env.REGION,
  SLACK_TOKEN: process.env.SLACK_TOKEN,
  OAUTH_TOKEN: process.env.OAUTH_TOKEN,
  ICON_EMOJI: ":bulb:",
};

module.exports = (key) => {
  if (!key) return config;

  return config[key];
};
