'use strict'

const { URL, parse } = require('url');

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

module.exports = validateURL;