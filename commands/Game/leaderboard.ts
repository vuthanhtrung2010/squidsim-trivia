import { MessageEmbed } from 'discord.js';

module.exports = {
  name: "leaderboard",
  category: "Game",
  aliases: ["topw", "wlb"],
  description: "Displays the leaderboard of users with the most wins.",
  cooldown: 10,
  usage: ".leaderboard",
  run: async (client, message, args, prefix) => {
    try {
      let lbDatas: number = 25;

      let users
      if (client.caches.has("lbData")) {
        users = client.caches.get("lbData")
      }
      else {
        users = await client.user_data.findMany({
          orderBy: {
            wins: 'desc'
          },
          take: lbDatas
        });
        client.caches.set("lbData", users)
      }

      const leaderboard = users
        .sort((userA, userB) => userB.wins - userA.wins)
        .slice(0, lbDatas);

      const embed = new MessageEmbed()
        .setTitle("Leaderboard")
        .setColor("#ff0000");

      let leaderboardText = "";
      leaderboard.forEach((user, index) => {
        let placeEmoji = "";

        if (index === 0) placeEmoji = ":first_place:";
        else if (index === 1) placeEmoji = ":second_place:";
        else if (index === 2) placeEmoji = ":third_place:";

        if (index < 3) leaderboardText += `${placeEmoji} `;
        else leaderboardText += `**${index + 1}.** `;

        leaderboardText += `<@${user.userID}>: ${user.wins} wins\n`;
      });

      embed.addFields({
        name: `Top ${lbDatas} users with the most wins:`,
        value: leaderboardText,
      });

      message.reply({ content: `<@${message.author.id}>`, embeds: [embed] });
    } catch (error) {
      console.error("An error occurred:", error);
    }
  },
};
