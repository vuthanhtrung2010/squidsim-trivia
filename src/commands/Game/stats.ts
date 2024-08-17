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

      const user = await message.guild?.members.fetch(userId);

      if (!user) {
        return message.channel.send("User not found in the server.");
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

      let WinRate = (userData.wins / (userData.wins + userData.stats[0].lost)) * 100;

      if (isNaN(WinRate)) {
        WinRate = 0;
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
            value: `> \`\`\`${WinRate.toFixed(2)}%\`\`\``,
            inline: true,
          },
        )
        .setAuthor({
          name: user.user.tag,
          iconURL: user.user.displayAvatarURL(),
        })
        .setColor("#ff0000");

      return message.reply({ embeds: [embed] });
    } catch (error) {
      client.sentry?.captureException(error);
      console.error("An error occurred:", error);
    }
  },
};
