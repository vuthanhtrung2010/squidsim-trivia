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
      let lbDatas = parseInt(args[0]) || 15;

      if (lbDatas > 25)
        return message.channel.send({
          content: "You can't see over top 25 users!",
        });
      let users
      if (client.caches.has("lbData")) {
        users = client.caches.get("lbData")
      }
      else {
        users = await client.user_data.findMany({});
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
      embed.setFooter("Use .lb <max count> to return max leaderboard datas");

      message.reply({ content: `<@${message.author.id}>`, embeds: [embed] });
    } catch (error) {
      console.error("An error occurred:", error);
    }
  },
};