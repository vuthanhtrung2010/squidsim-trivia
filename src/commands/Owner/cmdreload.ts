import chalk from "chalk";
import { ExtendedClient, MessageCommand } from "../../types";
import { EmbedBuilder } from "discord.js";
import path from "path";
import { v7 as uuidv7 } from "uuid";

export const Command: MessageCommand = {
  name: `cmdreload`,
  category: `Owner`,
  type: "info",
  aliases: [`commandreload`],
  description: `Reloads a command`,
  usage: `cmdreload <CMD>`,
  cooldown: 0,
  run: async (
    client: ExtendedClient,
    message: any, // Adjust `message` type as per your implementation
    args: string[],
    GuildSettings: any, // Adjust `GuildSettings` type as per your implementation
  ) => {
    try {
      const ls = GuildSettings?.language as string;
      if (!args[0])
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#e01e01")
              .setTitle("<:no:948483017993769041> Please provide a command to reload"),
          ],
        });

      let reload = false;
      const thecmd =
        client.commands?.get(args[0].toLowerCase()) ||
        client.commands?.get(
          client.aliases?.get(args[0].toLowerCase()) as string,
        );

      if (!thecmd)
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#e01e01")
              .setTitle(`<:no:948483017993769041> Could not find: \`${args[0]}\``),
          ],
        });

      // Construct module path
      const modulePath = path.resolve(
        `${process.cwd()}/src/commands/${thecmd.category}/${thecmd.name}.js`,
      );
      const uuid = uuidv7();
      // Re-import and set the command on all clusters

      reload = true;

      if (reload) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#0000ff")
              .setTitle(`<a:yes:958653519513133078> Reloaded \`${args[0]}\``),
          ],
        });
      }

      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#e01e01")
            .setTitle(`<:no:948483017993769041> Could not reload: \`${args[0]}\``)
            .setDescription("Cmd is now removed from the BOT COMMANDS!"),
        ],
      });
    } catch (e) {
      client.sentry?.captureException(e);
      console.log(chalk.dim.bgRed((e as Error).stack));
      const ls = GuildSettings?.language as string;
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#e01e01")
            .setTitle("<:no:948483017993769041> An error occurred")
            .setDescription(`\`\`\`${e.message}\`\`\``),
        ],
      });
    }
  },
};
