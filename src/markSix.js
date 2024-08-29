const prefix = "#marksix ";
const jsonFile = "marksix_alarm.json";
const htmlParser = require('node-html-parser');
const fileHelper = require('./fileHelper.js');

module.exports.task = function () {
  return async (msg) => {
    if (!msg.channel.guild) return;
    if (!msg.content.startsWith(prefix)) return;

    const command = msg.content.replace(prefix, "");
    try {
      let result = null;
      if (command.startsWith('info')) {
        result = await getMarkSixInfo();
      }
      if (command.startsWith('draw')) {
        result = drawMarkSix(command.replace('draw ', ''));
      }
      if (command.startsWith('alarm')) {
        result = setupAlarm(command.replace('alarm ', ''), msg.channel.id);
      }
      await msg.channel.createMessage(result);
    } catch (err) {
      console.warn("Failed to respond to MarkSix.");
      console.warn(err);
    }
  };
};

module.exports.alarm = async function (bot) {
  const json = JSON.parse(fileHelper.read(jsonFile) || '{}');
  const info = (await getMarkSixInfo()).split('\n');
  const prize = Number(info[11].replace(/\D/g, ''));
  let msg = `**[${getDayRemain(info[3])}]**\n`;
  msg += `The next MarkSix is up to **${info[11]}**. :robot:\n`;
  msg += `Deadline: ${info[5]} ${info[3]}.`;

  // send alert message to all registered channel if match conditions.
  for (const [channelId, value] of Object.entries(json)) {
    if (prize >= value) bot.createMessage(channelId, msg);
  }
};

async function getMarkSixInfo() {
  const res = await fetch('https://bet2.hkjc.com/marksix/index.aspx?lang=en');
  const html = htmlParser.parse(await res.text());
  return html.querySelector('table table table').structuredText;
}

function drawMarkSix(amount, range = 49) {
  const sets = new Set();
  const numOfSet = Number(amount) || 1;

  while (sets.size < numOfSet) {
    const set = new Set();
    while (set.size < 6) {
      const num = Math.floor(Math.random() * range) + 1;
      set.add(num >= 10 ? `${num}` : `0${num}`);
    }
    sets.add(Array.from(set).sort((a, b) => a - b).join(' '));
  }
  return Array.from(sets).join('\n');
}

function setupAlarm(command, channelId) {
  const json = JSON.parse(fileHelper.read(jsonFile) || '{}');
  let msg = '';
  if (command.startsWith('enable')) {
    msg = 'You will receive a MarkSix notification at 7pm. :robot:';
    json[channelId] = Number(command.replace(/\D/g, '')) || 0;
  }
  if (command.startsWith('disable')) {
    msg = 'You will no longer receive MarkSix notifications. :robot:';
    delete json[channelId];
  }
  fileHelper.write(jsonFile, JSON.stringify(json));
  return msg;
}

// assume the date string with format dd/mm/yyyy
function getDayRemain(text) {
  const date = text.trim().substring(0, 10).split('/')
  const diff = new Date(`${date[2]}-${date[1]}-${date[0]} 23:59:59`) - new Date();
  const days = Math.round(diff / (1000 * 3600 * 24));
  return days > 0 ? days > 1 ? `LAST ${days} DAYS` : 'TOMORROW' : 'TODAY';
}
