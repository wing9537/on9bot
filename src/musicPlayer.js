const prefix = "#play";
const ytdl = require("ytdl-core");
const options = { quality: "highestaudio", filter: "audioonly" };

module.exports = function (bot) {
  return async (msg) => {
    if (!msg.channel.guild) return;
    if (!msg.content.startsWith(prefix)) return;
    if (!msg.member.voiceState) return;

    try {
      const channelId = msg.member.voiceState.channelID;
      const conn = await bot.joinVoiceChannel(channelId, { selfDeaf: true });
      conn.play(ytdl("dy90tA3TT1c", options));
    } catch (err) {
      console.warn("Failed to respond to musicPlayer.");
      console.warn(err);
    }
  };
};
