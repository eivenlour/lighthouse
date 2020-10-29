'use strict'

const { URL, parse } = require('url');
const TinyURL = require('tinyurl');

const validateURL = (url) => {
  const protocols = ['http', 'https'];
  try {
    new URL(url);
    const parsed = parse(url);
    return protocols
      ? parsed.protocol
        ? protocols.map(x => `${x.toLowerCase()}:`).includes(parsed.protocol)
        : false
      : true;
  } catch (err) {
    return false;
  }
};

const shortenURL = async (url) => {
  let shortURL;
  try {
    shortURL = await TinyURL.shorten(url);
    return shortURL;
  } catch (err) {
    console.log("Something went wrong. Try again later.")
    return;
  }
};

module.exports = { validateURL, shortenURL };