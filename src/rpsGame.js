const prefix = "#rps";
const compArray = ["Rock", "Paper", "Scissors"];
const messageObj = {};

module.exports.list = function () {
  return async (msg) => {
    if (!msg.channel.guild) return;
    if (!msg.content.startsWith(`${prefix} start`)) return;
    try {
      const messageID = await msg.channel.createMessage({
        // embed: {
        //   title: `Rock Paper Scissors`,
        //   fields: [],
        // },
        components: [
          {
            type: 1,
            components: [
              {
                type: 2,
                emoji: { id: null, name: "🖐️" },
                style: 2,
                custom_id: `${msg.author.id} Paper`,
              },

              {
                type: 2,
                emoji: { id: null, name: "👊" },
                style: 2,
                custom_id: `${msg.author.id} Rock`,
              },

              {
                type: 2,
                emoji: { id: null, name: "✌️" },
                style: 2,
                custom_id: `${msg.author.id} Scissors`,
              },
            ],
          },
        ],
      });
      //const messageID = await msg.channel.createMessage("123");
      messageObj[msg.author.id] = messageID;
    } catch (err) {
      console.warn("Failed to respond to leetquery list.");
      console.warn(err);
    }
  };
};

module.exports.code = function () {
  return async (interaction) => {
    if (interaction.data.component_type !== 2) return;
    if (!compArray.includes(interaction.data.custom_id)) return;
    const ans = interaction.data.custom_id;
    await interaction.channel.createMessage(playRound(ans, computerPlay()));
    return await interaction.acknowledge();

    // if (params.length < 4) return;
    // try {
    //   const user = params[1];
    //   const bi = params[2].startsWith("bi") ? "bi" : "";
    //   const num = params[2].replace("bi", "");
    //   const key = params[3];
    //   const url = `${domain}/files/${bi}weekly-contest-${num}-${user}.json`;
    //   const res = await fetch(url);
    //   const dm = await interaction.member.user.getDMChannel();
    //   if (res.ok) {
    //     const data = await res.json();
    //     const code = `${data.username} ${key} :robot:\n${data[key].code}`;
    //     for (let i = 0, len = code.length; i < len; i += 2000)
    //       await dm.createMessage(code.substring(i, i + 1999));
    //   } else {
    //     return await dm.createMessage("no content. :robot:");
    //   }
    //   return await interaction.acknowledge();
    // } catch (err) {
    //   console.warn("Failed to respond to leetquery code.");
    //   console.warn(err);
    // }
  };
};

const computerPlay = () => {
  const ramdonValue = Math.floor(Math.random() * compArray.length);
  return compArray[ramdonValue];
};

const playRound = (playerSelection, computerSelection) => {
  if (
    (playerSelection === "Rock" && computerSelection === "Scissors") ||
    (playerSelection === "Paper" && computerSelection === "Rock") ||
    (playerSelection === "Scissors" && computerSelection === "Paper")
  ) {
    return `You Win This Round! ${playerSelection} beats ${computerSelection}.`;
  } else if (playerSelection === computerSelection) {
    return "Tie";
  } else {
    return `You Lose This Round! ${computerSelection} beats ${playerSelection}.`;
  }
};
