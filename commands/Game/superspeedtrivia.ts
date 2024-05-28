import { MessageEmbed, MessageButton, MessageActionRow } from 'discord.js';
import question from '../../questions.json'

module.exports = {
  name: `superspeedtrivia`,
  category: `Game`,
  aliases: [`trivia`, `spt`],
  description: `Do a quick quiz`,
  cooldown: 10,
  usage: `.spt`,
  run: async (client, message, args, prefix) => {
    try {
      let check_data = client.caches.get("isPlaying")

      if (check_data === true)
        return message.channel.send("A game is already started!");

      client.caches.set("isPlaying", true)
      
      let minq = 1;
      let maxq = 15;

      let lastQuestion = client.caches.get("lastQuestion");
      let currentQuestion;

      do {
        currentQuestion = Math.floor(Math.random() * (maxq - minq + 1)) + minq;
      } while (lastQuestion && currentQuestion === lastQuestion);

      client.caches.set("lastQuestion", currentQuestion)

      const random_q = `question${currentQuestion}`;
      const q = question[random_q];

      let q_data = q.question;
      let q_1 = q.ans1;
      let q_2 = q.ans2;
      let q_3 = q.ans3;
      let q_4 = q.ans4;

      let q_ans = q.answer;

      let button1 = new MessageButton()
        .setStyle("PRIMARY")
        .setCustomId("1")
        .setEmoji("1️⃣");

      let button2 = new MessageButton()
        .setStyle("PRIMARY")
        .setCustomId("2")
        .setEmoji("2️⃣");

      let button3 = new MessageButton()
        .setStyle("PRIMARY")
        .setCustomId("3")
        .setEmoji("3️⃣");

      let button4 = new MessageButton()
        .setStyle("PRIMARY")
        .setCustomId("4")
        .setEmoji("4️⃣");

      let correct_user = [];
      let interacted = [];
      const q_embed = new MessageEmbed()
        .setTitle("Super Speed Trivia Question")
        .setDescription(
          `TYPESCRIPT
      ${q_data}
      **1.** ${q_1}.
      **2.** ${q_2}.
      **3.** ${q_3}.
      **4.** ${q_4}.
      `
        )
        .setFooter("Choose wisely! - Made by trungisreal");

      const row = new MessageActionRow().addComponents(
        button1,
        button2,
        button3,
        button4
      );

      const sentMessage = await message.reply({
        content: `<t:${Math.floor((Date.now() + 5000) / 1000)}:R>`,
        embeds: [q_embed.setTimestamp()],
        components: [row],
      });

      const filter = (i) => !i.user.bot;
      const collector = sentMessage.createMessageComponentCollector({
        filter,
        time: 5000,
      });

      collector.on("collect", async (interaction) => {
        try {
          if (interacted.includes(interaction.user.id)) {
            await interaction.reply({
              content: "You have already chosen!",
              ephemeral: true,
            });
            return;
          }

          let isCorrect = false;
          if (interaction.customId == q_ans) {
            isCorrect = true;
          }

          if (isCorrect) {
            correct_user.push(interaction.user.id);

            await interaction.reply({
              content: "You chose the correct answer!",
              ephemeral: true,
            });
          } else {
            await interaction.reply({
              content: "You chose the wrong answer!",
              ephemeral: true,
            });
          }

          interacted.push(interaction.user.id);
        } catch (error) {
          console.error("An error occurred:", error);
        }
      });

      collector.on("end", async () => {
        button1.setDisabled(true);
        button2.setDisabled(true);
        button3.setDisabled(true);
        button4.setDisabled(true);

        row.components = [button1, button2, button3, button4];

        sentMessage.edit({
          content: `Time is over!`,
          embeds: [q_embed],
          components: [row],
        });

        client.caches.set("isPlaying", false);
        
        let updated_data;
        for (const userId of correct_user) {
          updated_data = await client.prisma.userData.upsert({
            where: {
              userID: userId,
            },
            update: {
              wins: {
                increment: 1
              }
            },
            create: {
              wins: 1,
              userID: userId
            },
          });
          client.caches.set(`${userId}.wins`, updated_data.wins)
        }

        if (correct_user.length > 0) {
          const winners = correct_user
            .map((userId) => `<@${userId}>`)
            .join(", ");
          const congratulationsMessage = `Congratulations ${winners}! You have the correct answer!\nYou have been added 1 win.`;
          message.channel.send(congratulationsMessage);
        }
      });
    } catch (error) {
      console.error("An error occurred:", error);
    }
  },
};