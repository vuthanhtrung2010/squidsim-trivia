const {
  MessageEmbed,
  Util: { splitMessage },
} = require(`discord.js`);
const fs = require("fs");
const { inspect } = require(`util`);
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
              .setColor(es.color)
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
      //split the description
      const splitDescription = splitMessage(string, {
        maxLength: 1024,
        char: `\n`,
        prepend: ``,
        append: ``,
      });
      let input_msg = `\`\`\`js\n${args.join(" ")}\`\`\``;
      let output_msg = `\`\`\`${splitDescription[0]}\`\`\``;
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
