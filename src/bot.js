const eris = require("eris");
const config = require("../config.json");
const mention = require("./mention");
const leetquery = require("./leetquery");
const binCalculator = require("./binCalculator");

// Create a Client instance with our bot token.
const bot = new eris.Client(config.token);
const botName = "on9bot";

// When the bot is connected and ready, log to console.
bot.on("ready", () => console.log("Connected and ready."));

// it will check if the bot was mentioned.
bot.on("messageCreate", mention(botName));

// it will return leetquery content.
bot.on("messageCreate", leetquery.list());

// it will return leetquery code.
bot.on("interactionCreate", leetquery.code());

// it will handle binary calculation with single operator.
bot.on("messageCreate", binCalculator());

// unexpected system error handling
bot.on("error", (err) => console.warn(err));

bot.connect();
