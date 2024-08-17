import { EmbedBuilder } from "discord.js";
import { MessageCommand } from "../../types";

export const Command: MessageCommand = {
  name: "stats",
  category: "Game",
  description: "Displays your game stats.",
  cooldown: 1,
  usage: "stats",
  run: async (client, message, args, prefix) => {
    try {
      let userId = args[0];

      if (!userId) {
        userId = message.author.id;
      } else if (userId.startsWith("<@") && userId.endsWith(">")) {
        userId = userId.slice(2, -1);
        if (userId.startsWith("!")) {
          userId = userId.slice(1);
        }
      }

      const userData = await client.database.userData.findUnique({
        where: {
          userID: userId,
        },
        include: {
          stats: true,
        },
      });

      if (!userData) {
        return message.channel.send("User not found in database.");
      }

      const embed = new EmbedBuilder()
        .setTitle("Game Stats")
        .addFields(
          {
            name: "Wins",
            value: `> \`\`\`${userData.wins}\`\`\``,
            inline: true,
          },
          {
            name: "Losses",
            value: `> \`\`\`${userData.stats[0].lost}\`\`\``,
            inline: true,
          },
          {
            name: "Command Executed",
            value: `> \`\`\`${userData.stats[0].commands}\`\`\``,
            inline: true,
          },
          {
            name: "Win rate",
            value: `> \`\`\`${((userData.wins / (userData.wins + userData.stats[0].lost)) * 100).toFixed(2)}%\`\`\``,
            inline: true,
          },
        )
        .setAuthor({
          name: message.author.tag,
          iconURL: message.author.displayAvatarURL({ size: 64 }),
        })
        .setColor("#ff0000");

      return message.reply({ embeds: [embed] });
    } catch (error) {
      client.sentry?.captureException(error);
      console.error("An error occurred:", error);
    }
  },
};
