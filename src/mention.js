module.exports = function (botName) {
  return async (msg) => {
    const botWasMentioned = msg.mentions.find(
      (mentionedUser) => mentionedUser.username === botName
    );
    try {
      if (botWasMentioned && msg.channel.guild) {
        if (msg.content.replace(/<@[0-9]+>/g, "").trim().length > 0)
          await msg.channel.createMessage("umm... Don't know up what. :robot:");
        else
          await msg.channel.createMessage(`Hey there! I'm ${botName}. :robot:`);
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
