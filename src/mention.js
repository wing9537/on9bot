module.exports = function (botName) {
  return async (msg) => {
    const botWasMentioned = msg.mentions.find((mentionedUser) => mentionedUser.username === botName);
    try {
      if (botWasMentioned && msg.channel.guild) {
        let content = msg.content.replace(/<@[0-9]+>/g, "").trim();
        if (new RegExp(/^[A-Z]{3} TO [A-Z]{3}$/g).test(content.toUpperCase())) {
          content = content.toUpperCase().split(" TO ");
          await msg.channel.createMessage(await getExchangeRate(content));
        } else if (content.length > 0) {
          await msg.channel.createMessage("umm... Don't know up what. :robot:");
        } else {
          await msg.channel.createMessage(`Hey there! I'm ${botName}. :robot:`);
        }
      }
      if (!msg.channel.guild && !msg.author.bot) {
        const dm = await msg.author.getDMChannel();
        await dm.createMessage("Alt + F4 to enable a secret chat. :robot:");
      }
    } catch (err) {
      console.warn("Failed to respond to mention.");
      console.warn(err);
    }
  };
};

const currencyLink = "https://query1.finance.yahoo.com/v8/finance/chart/";
const currencyList = ["HKD", "JPY", "KRW", "TWD", "CNY", "USD", "EUR", "GBP", "AUD", "THB"];
const getExchangeRate = async ([c1, c2]) => {
  let msg = "Unexpected currency. :robot:";
  if (c1 != c2 && currencyList.includes(c1) && currencyList.includes(c2)) {
    const res = await fetch(`${currencyLink + c1 + c2}=X`);
    if (res.ok) {
      const data = await res.json();
      msg = data.chart.result[0].meta.previousClose + " :robot:";
    }
  }
  return msg;
};
