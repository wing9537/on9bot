const prefix = "#timer ";

function dateDiffInDays(a, b) {
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(0, 0, 0, a.getHours(), a.getMinutes());
  const utc2 = Date.UTC(0, 0, 0, b.getHours(), b.getMinutes());
  return utc2 - utc1;
}
const alarm = function (msg) {
  msg.channel.createMessage(`<@${msg.author.id}> Now :robot:`);
};

module.exports = function () {
  return async (msg) => {
    if (!msg.channel.guild) return;
    if (!msg.content.startsWith(prefix)) return;

    try {
      const timestamp = msg.content.replace(prefix, "");
      const hour = timestamp.substr(0, 2);
      const min = timestamp.substr(2, 2);
      const date = new Date(0, 0, 0, hour, min);
      const diffTime = dateDiffInDays(new Date(), date);
      setTimeout(() => alarm(msg), diffTime);
    } catch (err) {
      console.warn("Failed to respond to Timer.");
      console.warn(err);
    }
  };
};
