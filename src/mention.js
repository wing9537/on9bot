module.exports = function (bot) {
  return async (msg) => {
    const botWasMentioned = msg.mentions.find(
      (mentionedUser) => mentionedUser.id === bot.user.id
    );
    try {
      if (botWasMentioned && msg.channel.guild) {
        await msg.channel.createMessage("Hey there! I'm on9bot... :robot:");
      }
      if (!msg.channel.guild && !msg.author.bot) {
        let dm = await msg.author.getDMChannel();
        await dm.createMessage("Alt + F4 to enable a secret chat. :robot:");
      }
    } catch (err) {
      console.warn("Failed to respond to mention.");
      console.warn(err);
    }
  };
};
