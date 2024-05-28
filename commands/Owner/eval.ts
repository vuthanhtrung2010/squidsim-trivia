import { MessageEmbed } from "discord.js";
import { inspect } from 'util';

module.exports = {
  name: `eval`,
  category: `Owner`,
  aliases: [`evaluate`],
  description: `eval Command`,
  usage: `eval <CODE>`,
  type: "bot",
  run: async (client, message, args, prefix) => {
    if ("1139406664584409159" !== message.author?.id)
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setTitle("Missing perm"),
        ],
      });
    if (!args[0])
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setTitle(eval("Provide code to eval")),
        ],
      });
    let evaled;
    try {
      if (args.join(` `).includes(`token`))
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setTitle(eval("Trung | Evaluation"))
              .setColor("RED")
              .addFields(
                { name: ":inbox_tray: Input", value: args.join(` `) },
                {
                  name: ":outbox_tray: Output",
                  value: "```[CENSORED_BOT_TOKEN]```",
                },
              ),
          ],
        });

      evaled = await eval(args.join(` `));
      //make string out of the evaluation
      let string = inspect(evaled);
      let evalEmbed = new MessageEmbed()
        .setTitle("Trung | Evaluation")
        .setColor("BLUE");

      let input_msg = `\`\`\`js\n${args.join(" ")}\`\`\``;
      let output_msg = `\`\`\`${string.substring(0, 1000)}\`\`\``;
      //(over)write embed description
      evalEmbed.addFields(
        { name: ":inbox_tray: Input", value: input_msg },
        { name: ":outbox_tray: Output", value: output_msg },
      );

      message.channel.send({ embeds: [evalEmbed] });
    } catch (e) {
      console.log(String(e.stack));
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setTitle("Err orrcured!")
            .setDescription(`Error \`\`\`${e}\`\`\``),
        ],
      });
    }
  },
};
