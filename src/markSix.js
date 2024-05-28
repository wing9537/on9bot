const prefix = "#marksix ";
const htmlParser = require('node-html-parser');
const fileHelper = require('./fileHelper.js');

module.exports = function () {
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

async function getMarkSixInfo() {
  const res = await fetch('https://bet.hkjc.com/marksix/index.aspx?lang=en');
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

function setupAlarm(flag, channelId) {
  const channelIds = fileHelper.read('marksix_alarm.txt').split(',').filter(v => v);
  const index = channelIds.indexOf(channelId);
  let msg = 'Done!';
  if (flag === 'enable' && index == -1) {
    channelIds.push(channelId);
    msg = 'You will receive a notification at 7am every day. :robot:';
  }
  if (flag === 'disable' && index > -1) {
    channelIds.splice(index, 1);
    msg = 'You will no longer receive notifications. :robot:';
  }
  fileHelper.write('marksix_alarm.txt', channelIds.join());
  return msg;
}