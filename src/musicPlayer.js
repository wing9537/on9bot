const prefix = "#play";
const ytdl = require("ytdl-core");
const options = { quality: "highestaudio", filter: "audioonly", highWaterMark: 1 << 25 };

module.exports = function (bot) {
  return async (msg) => {
    if (!msg.channel.guild) return;
    if (!msg.content.startsWith(prefix)) return;
    if (!msg.member.voiceState) return;

    try {
      const link = msg.content.replace(prefix, "").trim() || "bP9gMpl1gyQ";
      const channelId = msg.member.voiceState.channelID;
      const conn = await bot.joinVoiceChannel(channelId);
      conn.play(ytdl(link, options));
    } catch (err) {
      console.warn("Failed to respond to musicPlayer.");
      console.warn(err);
    }
  };
};
