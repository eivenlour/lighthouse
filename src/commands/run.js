"use strict";

const _ = require("lodash");
const config = require("../config");
const { generateFullReport } = require("../tasks/generate-report");

const msgDefaults = {
  response_type: "in_channel",
  username: "Lighthouse",
  icon_emoji: config("ICON_EMOJI"),
};

/* GENERATED REPORT MESSAGE */
const getMessage = async (url) => {
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
}
;

const handler = async (payload, res) => {
	const url = payload.text.split(' ')[1];
  let msg = _.defaults(
    {
      channel: payload.channel_name,
      blocks: await getMessage(url),
    },
    msgDefaults
  );

  res.set("content-type", "application/json");
  res.status(200).json(msg);
  return;
};

module.exports = { pattern: /run .*/, handler: handler };
