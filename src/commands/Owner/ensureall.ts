import { Message, EmbedBuilder } from 'discord.js';

module.exports = {
  name: `ensureall`,
  category: `Owner`,
  aliases: [],
  description: `Ensure all non-bot server members are present in the database.`,
  usage: `ensureall`,
  type: "bot",
  run: async (client, message, args, prefix): Promise<Message<boolean>> => {
    try {
      if ("1139406664584409159" !== message.author?.id)
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("RED")
              .setTitle("Missing permission")
              .setDescription("You are not authorized to use this command."),
          ],
        });

      const guild = message.guild;
      if (!guild) return;
      await guild.members.fetch();

      guild.members.cache.forEach(async (member) => {
        if (!member.user.bot) {
          const exist_check = await client.prisma.userData.findUnique({
            where: {
              userID: member.id,
            },
          });
          if (!exist_check) {
            await client.prisma.userData.create({
              data: {
                userID: member.id,
                wins: 0,
              },
              
            });
          }
        }
      });

      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("GREEN")
            .setTitle("Database Ensure Complete")
            .setDescription(
              "All non-bot server members have been ensured in the database.",
            ),
        ],
      });
    } catch (error) {
      console.error("An error occurred:", error);
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("RED")
            .setTitle("Error")
            .setDescription(
              "An error occurred while ensuring members in the database.",
            ),
        ],
      });
    }
  },
};
