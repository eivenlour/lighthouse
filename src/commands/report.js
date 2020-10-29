'use strict'

const aws = require('aws-sdk');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const { v1: uuidv1 } = require('uuid');
const config = require('../config');
const { deviceForms } = require('../constants');
const validateURL = require('../helpers/url-validator');

const s3 = new aws.S3({
  accessKeyId: config('AWS_ACCESS_KEY_ID'),
  secretAccessKey: config('AWS_SECRET_ACCESS_KEY'),
  region: config('REGION')
});

const uploadFile = file => {
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

  s3.upload(params, function(err, data) {
    if (err) {
      console.log('Something went wrong. Try again later.');
    }
      console.log(`File uploaded successfully. ${data.Location}`);
  });

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
  uploadFile(reportFile);

  await chrome.kill();
};

const generateFullReport = async (url) => {
  await generateCustomizedReport(url, null, deviceForms.MOBILE);
};

module.exports = { generateFullReport, generateCustomizedReport };