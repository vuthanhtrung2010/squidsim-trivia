const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'leaderboard',
  category: 'Game',
  aliases: ['topw', 'wlb'],
  description: 'Displays the leaderboard of users with the most wins.',
  cooldown: 10,
  usage: '.leaderboard',
  run: async (client, message, args, prefix) => {
    try {
      let lbDatas = args[0] || 15;

      const users = await client.user_data.all();

      const userData = users.reduce((acc, { ID, data }) => {
        acc[ID] = data;
        return acc;
      }, {});

      const leaderboard = Object.entries(userData)
        .sort(([, dataA], [, dataB]) => dataB.wins - dataA.wins)
        .slice(0, lbDatas);

      const embed = new MessageEmbed()
        .setTitle('Leaderboard')
        .setColor('#ff0000');

      let leaderboardText = '';
      leaderboard.forEach(([userId, data], index) => {
        const user = client.users.cache.get(userId);
        let placeEmoji = '';

        if (index === 0) placeEmoji = ':first_place:';
        else if (index === 1) placeEmoji = ':second_place:';
        else if (index === 2) placeEmoji = ':third_place:';

        if (index < 3) leaderboardText += `${placeEmoji} `;
        else leaderboardText += `**${index + 1}.** `;

        if (user) {
          leaderboardText += `<@${user.id}>: ${data.wins} wins\n`;
        }
      });

      embed.addFields({name: `Top ${lbDatas} users with the most wins:`, value: leaderboardText});
      embed.setFooter("Use .lb <max count> to return max leaderboard datas");
      
      message.reply({ content: `<@${message.author.id}>`, embeds: [embed] });
    } catch (error) {
      console.error('An error occurred:', error);
    }
  },
};
