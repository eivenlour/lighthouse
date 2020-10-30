"use strict";

const _ = require("lodash");
const config = require("../config");
const { generateFullReport } = require("../tasks/generate-report");
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

const sendLoadingMessage = async (payload, res) => {
  if (payload) {
    let loading = _.defaults(
      {
        channel: payload.channel_name,
        blocks:  loadingMessage
      },
      msgDefaults
    );
    await res.set('content-type', 'application/json');
    await res.status(200).json(loading);
  } 
};

/* GENERATED REPORT MESSAGE */
const getReportMessage = async (url) => {
  const reportURL = await generateFullReport(url);
  let block = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `Report link: ${reportURL}`,
      }
    }
  ];
  return block;
};

const handler = async (payload, res) => {
  
  sendLoadingMessage(payload, res).then( async () => {
    const token = process.env.OAUTH_TOKEN;
    const web = new WebClient(token);
    const url = payload.text.split(' ')[1];  
  
    let msg = _.defaults(
      {
        channel: payload.channel_name,
        blocks: await getReportMessage(url)
      },
      msgDefaults
    );
  
    await web.chat.postMessage(msg);
  });
  


  return;
};

module.exports = { pattern: /run .*/, handler: handler };
