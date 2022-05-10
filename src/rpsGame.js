const prefix = "#rps";
const compArray = ["Rock", "Paper", "Scissors"];
const messageObj = {};

module.exports.onStart = function () {
  return async (msg) => {
    if (!msg.channel.guild) return;
    if (!msg.content.startsWith(`${prefix} start`)) return;
    try {
      const userId = msg.author.id;
      const messageID = await msg.channel.createMessage({
        content: `<@${userId}> Let's play. :robot:`,
        components: [
          {
            type: 1,
            components: [
              {
                type: 2,
                emoji: { id: null, name: "🖐️" },
                style: 2,
                custom_id: `${prefix} ${userId} Paper`,
              },
              {
                type: 2,
                emoji: { id: null, name: "👊" },
                style: 2,
                custom_id: `${prefix} ${userId} Rock`,
              },
              {
                type: 2,
                emoji: { id: null, name: "✌️" },
                style: 2,
                custom_id: `${prefix} ${userId} Scissors`,
              },
            ],
          },
        ],
      });
      messageObj[userId] = messageID;
    } catch (err) {
      console.warn("Failed to respond to rpsGame onStart.");
      console.warn(err);
    }
  };
};

module.exports.onClick = function () {
  return async (interaction) => {
    if (interaction.data.component_type !== 2) return;
    if (!interaction.data.custom_id.startsWith(prefix)) return;

    const userId = interaction.member.user.id;
    const params = interaction.data.custom_id.split(" ");
    if (params.length < 3) return;
    try {
      if (userId == params[1]) {
        const result = rpsResult(params[2], computerPlay());
        await messageObj[userId].edit(`<@${userId}> ${result} :robot:`);
      }
      return await interaction.acknowledge();
    } catch (err) {
      console.warn("Failed to respond to rpsGame click.");
      console.warn(err);
    }
  };
};

const computerPlay = () => {
  const ramdonValue = Math.floor(Math.random() * compArray.length);
  return compArray[ramdonValue];
};

const rpsResult = (playerSelection, computerSelection) => {
  if (
    (playerSelection === "Rock" && computerSelection === "Scissors") ||
    (playerSelection === "Paper" && computerSelection === "Rock") ||
    (playerSelection === "Scissors" && computerSelection === "Paper")
  ) {
    return `You Win This Round! **${playerSelection}** beats **${computerSelection}**.`;
  } else if (playerSelection === computerSelection) {
    return "Tie";
  } else {
    return `You Lose This Round! **${computerSelection}** beats **${playerSelection}**.`;
  }
};
