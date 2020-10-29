"use strict";

const _ = require("lodash");
const config = require("../config");

const msgDefaults = {
  response_type: "in_channel",
  username: "Lighthouse",
  icon_emoji: config("ICON_EMOJI"),
};

/* BUTTON ACTIONS - FULL OR CUSTOM REPORT */
let blocks = [
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text:
        "Hey there 👋 I'm Lighthouse. \n\nI'm here to help you identify and fix common problems that affect your site's performance, accessibility, and user experience. Learn more about me <https://developers.google.com/web/tools/lighthouse/?utm_source=devtools|here>.\n\n",
    },
    accessory: {
      type: "image",
      image_url:
        "https://www.leankoala.com/media/249/download/lighthouse.png?v=1",
      alt_text: "lighthouse logo",
    },
  },
  {
    type: "divider",
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text:
        "*What would you like to do?*\n You can choose to run the full report, or select the specific audits you'd like to run. Information on all the audits can be found <https://web.dev/learn/#lighthouse|here>. ",
    },
  },
  {
    type: "actions",
    elements: [
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "Run full report",
        },
        value: "full_report",
      },
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "Customize report",
        },
        value: "custom_report",
      },
    ],
  },
];

const handler = (payload, res) => {
  let msg = _.defaults(
    {
      channel: payload.channel_name,
      blocks,
    },
    msgDefaults
  );

  res.set("content-type", "application/json");
  res.status(200).json(msg);
  return;
};

module.exports = { pattern: /help/gi, handler: handler };
