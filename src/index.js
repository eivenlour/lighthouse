"use strict";

const express = require("express");
const proxy = require("express-http-proxy");
const bodyParser = require("body-parser");
const _ = require("lodash");
const config = require("./config");
const commands = require("./commands");
const helpCommand = require("./commands/help");

let bot = require("./bot");
let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* COMMAND: `/lighthouse` */
app.post("/commands/lighthouse", (req, res) => {
  let payload = req.body;
  let cmd = helpCommand;
  cmd.handler(payload, res);
});

/* LOCAL DEVELOPMENT */
if (config("PROXY_URI")) {
  app.use(
    proxy(config("PROXY_URI"), {
      forwardPath: (req, res) => {
        return require("url").parse(req.url).path;
      },
    })
  );
}

app.get("/", (req, res) => {
  res.send("\n 💡Lighthouse💡 \n");
});

app.listen(config("PORT"), (err) => {
  if (err) throw err;

  console.log(`\n🚀  Lighthouse LIVES on PORT ${config("PORT")} 🚀`);

  if (config("SLACK_TOKEN")) {
    console.log(`🤖  beep boop: @lighthouse is real-time\n`);
    bot.listen({ token: config("SLACK_TOKEN") });
  }
});