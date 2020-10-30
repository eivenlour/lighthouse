"use strict";

const _ = require("lodash");
const config = require("../config");
const { generateFullReport } = require("../tasks/generate-report");
const http = require('http');

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
		replace_original: true
	}
];


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
	if (payload) {
		let loading = _.defaults(
			{
				channel: payload.channel_name,
				blocks: loadingMessage
			},
			msgDefaults
		);
		res.status(200).json(loading);
	}

	const url = payload.text.split(' ')[1];
  let msg = _.defaults(
    {
      channel: payload.channel_name,
      blocks: await getReportMessage(url),
    },
    msgDefaults
	);
	
	const post_options = {
		url: payload.response_url,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		}
	}

	var post_req = http.request(post_options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
				console.log('Response: ' + chunk);
				});
		});

	post_req.write(msg);
  return;
};

module.exports = { pattern: /run .*/, handler: handler };
