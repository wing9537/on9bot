const eris = require("eris");
const config = require("../config.json");
const mention = require("./mention");
const leetquery = require("./leetquery");

// Create a Client instance with our bot token.
const bot = new eris.Client(config.token);

// When the bot is connected and ready, log to console.
bot.on("ready", () => {
  console.log("Connected and ready.");
});

// this funcntion will fire and we will check if the bot was mentioned.
bot.on("messageCreate", mention(bot));

// this funcntion will return leetquery contents.
bot.on("messageCreate", leetquery.list());

// this funcntion will return leetquery code.
bot.on("interactionCreate", leetquery.code());

bot.on("error", (err) => {
  console.warn(err);
});

bot.connect();
