'use strict'

const aws = require('aws-sdk');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const { v1: uuidv1 } = require('uuid');
const config = require('../config');
const { deviceForms } = require('../constants');
const { validateURL, shortenURL } = require('../helpers/url-helper');

const s3 = new aws.S3({
  accessKeyId: config('AWS_ACCESS_KEY_ID'),
  secretAccessKey: config('AWS_SECRET_ACCESS_KEY'),
  region: config('REGION')
});

const uploadFile = async (file) => {
  const uniqueId = uuidv1();
  const fileName = `report-${uniqueId}.html`;
  const fileType = 'text/html';
  const storageClass = 'STANDARD';
  const acl = 'public-read'

  const params = {
    Bucket: config('S3_BUCKET'),
    Key: fileName,
    Body: file,
    StorageClass: storageClass,
    ContentType: fileType,
    ACL: acl
  };

  try {
    let data = await s3.upload(params).promise();
    return await shortenURL(data.Location);
  } catch (err) {
    console.log('Something went wrong. Try again later.');
    return;
  }

};

const generateCustomizedReport = async (url, categoryList, deviceForm) => {

  if (!(validateURL(url))) {
    console.log('The URL you entered is invalid. Please try again.')
    return;
  }

  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless']
  });

  const options = {
    output: 'html',
    onlyCategories: categoryList,
    emulatedFormFactor: deviceForm,
    port: chrome.port
  };
  
  const runnerResult = await lighthouse(url, options);
  const reportFile = Buffer.from(runnerResult.report, 'utf-8');
  const reportURL = await uploadFile(reportFile);

  await chrome.kill();

  return reportURL;
};

const generateFullReport = async (url) => {
  return await generateCustomizedReport(url, null, deviceForms.MOBILE);
};

module.exports = { generateFullReport, generateCustomizedReport };