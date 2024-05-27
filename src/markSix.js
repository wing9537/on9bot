const prefix = "#marksix ";
const HTMLParser = require('node-html-parser');

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
        result = drawMarkSix(command.replace('draw', ''));
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
  const html = HTMLParser.parse(await res.text());
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