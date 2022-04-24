const prefix = "#leetq ";
const colour = [0xff0000, 0x0ff000, 0x00ff00, 0x000ff0, 0x0000ff];
const domain = "http://jasonisgod.xyz/leetquery";

module.exports.list = function () {
  return async (msg) => {
    if (!msg.channel.guild) return;
    if (!msg.content.startsWith(prefix)) return;

    const params = msg.content.split(" ");
    if (params.length < 3) return;
    try {
      const user = params[1];
      const bi = params[2].startsWith("bi") ? "bi" : "";
      const num = params[2].replace("bi", "");
      const url = `${domain}/files/${bi}weekly-contest-${num}-${user}.json`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        await msg.channel.createMessage({
          embed: {
            title: `${data.username} (#${data.rank})`,
            color: colour[Math.floor(Math.random() * 5)],
            fields: ["Q1", "Q2", "Q3", "Q4"].map((key) => ({
              name: key,
              value: data[key].solve_time || "no result",
              inline: true,
            })),
          },
          components: [
            {
              type: 1,
              components: ["Q1", "Q2", "Q3", "Q4"].map((key) => ({
                type: 2,
                label: `${key} </>`,
                style: 2,
                disabled: !data[key].solve_time,
                custom_id: `${msg.content} ${key}`,
              })),
            },
          ],
        });
      } else {
        await msg.channel.createMessage("no content. :robot:");
      }
    } catch (err) {
      console.warn("Failed to respond to leetquery list.");
      console.warn(err);
    }
  };
};

module.exports.code = function () {
  return async (interaction) => {
    if (interaction.data.component_type !== 2) return;
    if (!interaction.data.custom_id.startsWith(prefix)) return;

    const params = interaction.data.custom_id.split(" ");
    if (params.length < 4) return;
    try {
      const user = params[1];
      const bi = params[2].startsWith("bi") ? "bi" : "";
      const num = params[2].replace("bi", "");
      const key = params[3];
      const url = `${domain}/files/${bi}weekly-contest-${num}-${user}.json`;
      const res = await fetch(url);
      const dm = await interaction.member.user.getDMChannel();
      if (res.ok) {
        const data = await res.json();
        const code = `${data.username} ${key} :robot:\n${data[key].code}`;
        for (let i = 0, len = code.length; i < len; i += 2000)
          await dm.createMessage(code.substring(i, i + 1999));
      } else {
        return await dm.createMessage("no content. :robot:");
      }
      return await interaction.acknowledge();
    } catch (err) {
      console.warn("Failed to respond to leetquery code.");
      console.warn(err);
    }
  };
};
