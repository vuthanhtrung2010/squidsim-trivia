import { EmbedBuilder } from 'discord.js';
import { MessageCommand } from '../../types';

export const Command: MessageCommand = {
  name: "wins",
  category: "Game",
  description: "Displays your number of wins.",
  cooldown: 1,
  usage: "wins",
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
      let userData;

      if (client.caches.has(`${userId}.wins`)) {
        userData = client.caches.get(`${userId}.wins`);
      } else {
        userData = await client.database.userData.findUnique({
          where: {
            userID: userId,
          },
        });
      }

      if ((!userData && !userData.wins) || userData.wins === 0) {
        return message.channel.send(`<@${userId}> haven't won any games yet!`);
      }

      const wins = userData.wins || userData;
      const user = await client.users.fetch(userId);

      const embed = new EmbedBuilder()
        .setTitle("Wins Count")
        .setDescription(`<@${userId}> have ${wins} wins.`)
        .setAuthor({
          name: user.tag,
          iconURL: user.displayAvatarURL({ size: 64 }),
        })
        .setColor("#ff0000");

      message.reply({ embeds: [embed] });

      // Make sure up-to-date
      const data = await client.database.userData.findUnique({
        where: {
          userID: userId,
        },
      });
      client.caches.set(`${userId}.wins`, data.wins)
    } catch (error) {
      console.error("An error occurred:", error);
    }
  },
};
