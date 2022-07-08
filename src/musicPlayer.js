// const prefix = "#play";
const ytdl = require("ytdl-core");
const options = { quality: "highestaudio", filter: "audioonly", highWaterMark: 1 << 25 };

function youtube_parser(url){
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = url.match(regExp);
  return (match&&match[7].length==11)? match[7] : false;
}

module.exports = function (bot) {
  return async (msg) => {
    if (!msg.channel.guild) return;
    if (!msg.member.voiceState) return;
    
    try {
      
      var channelId = msg.member.voiceState.channelID;
      var conns = bot.voiceConnections;

      if (msg.content.startsWith("#help")) {
        await msg.channel.createMessage(`:robot:\n#hi\n#bye\n#play <youtube-url>\n#stop`);
      }

      if (msg.content.startsWith("#hi")) {
        if (conns.size == 0) {
          bot.joinVoiceChannel(channelId);
        }
      }

      if (msg.content.startsWith("#bye")) {
        if (conns.size > 0) {
          bot.leaveVoiceChannel(channelId);
        }
      }

      if (msg.content.startsWith("#play")) {
        var arg = msg.content.split(" ")[1].trim();
        if (arg == "") {
          arg = "https://www.youtube.com/watch?v=bP9gMpl1gyQ";
        }
        var link = youtube_parser(arg);
        if (conns.size > 0) {
          var conn = conns.entries().next().value[1];
          conn.stopPlaying();
          conn.play(ytdl(link, options));
        } else {
          var conn = await bot.joinVoiceChannel(channelId);
          conn.play(ytdl(link, options));
        }
      }

      if (msg.content.startsWith("#stop")) {
        if (conns.size > 0) {
          var conn = conns.entries().next().value[1];
          conn.stopPlaying();
        }
      }

    } catch (err) {
      console.warn("musicPlayer error");
      console.warn(err);
    }

  };
};
