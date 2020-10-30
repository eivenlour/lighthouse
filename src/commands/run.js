"use strict";

const _ = require("lodash");
const config = require("../config");
const { generateFullReport } = require("../tasks/generate-report");
const axios = require('axios');
const { WebClient } = require('@slack/web-api');

const msgDefaults = {
  response_type: "in_channel",
  username: "Lighthouse",
  icon_emoji: config("ICON_EMOJI"),
};

/* LOADING MESSAGE */
const loadingMessage = [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `Running report...`,
    },
  }
];


/* GENERATED REPORT MESSAGE */
const getReportMessage = async (url) => {
  //const reportURL = await generateFullReport(url);
  let block = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `Report link: ${url}`,
      }
    }
  ];
  return block;
};

const handler = async (payload, res) => {
  
  if (payload) {
    const url = payload.text.split(' ')[1];  

    let loading = _.defaults(
      {
        channel: payload.channel_name,
        blocks:  await getReportMessage(url)
      },
      msgDefaults
    );
    res.set('content-type', 'application/json');
    res.status(200).json(loading);
  } 

  const token = process.env.OAUTH_TOKEN;
  const web = new WebClient(token);

  let msg = _.defaults(
    {
      channel: payload.channel_name,
      blocks: loadingMessage
    },
    msgDefaults
  );

  await web.chat.postMessage(msg);
  /*
  //const url = payload.text.split(' ')[1];  
 

  await axios.post(
    payload.response_url,
    JSON.stringify(msg), {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
  */

  return;
};

module.exports = { pattern: /run .*/, handler: handler };
