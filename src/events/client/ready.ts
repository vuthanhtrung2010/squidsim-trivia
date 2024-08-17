import chalk from "chalk";
import { ClientEvent, ExtendedClient } from "../../types";
import { version } from "discord.js";

const logBanner = (stringLength: number, client: ExtendedClient): void => {
  console.log(
    chalk.bold.greenBright(`
        ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
        ┃ ${" ".repeat(stringLength - 4)}┃
        ┃ ${chalk.bold.greenBright(`Discord Bot is online!`)}${" ".repeat(stringLength - 20 - ` ┃ `.length)}┃
        ┃ ${`/--/ ${client.user?.tag} /--/ `}${" ".repeat(stringLength - 10 - ` /--/ ${client.user?.tag} /--/ `.length)}┃
        ┃ ${" ".repeat(stringLength - 4)}┃
        ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    `),
  );
};

export const Event: ClientEvent = {
  name: "ready",
  run: async (client): Promise<void> => {
    try {
      const stringLength = 69;
      console.log("\n");
      logBanner(stringLength, client);

      console.table({
        "Bot User:": `${client.user?.tag}`,
        "Guild(s):": `${client.guilds.cache.size} Servers`,
        "Watching:": `${client.guilds.cache.reduce((a: number, b: { memberCount: number }) => a + b?.memberCount || 0, 0)} Members`,
        "Prefix:": `!`,
        "Commands:": `${client.commands?.size}`,
        "Discord.js:": `v${version}`,
        "Node.js:": `${process.version}`,
        "Platform:": `${process.platform} ${process.arch}`,
        "Memory:": `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`,
      });
    } catch (e) {
      client.sentry?.captureException(e);
      console.error(chalk.red(`Error initializing bot: ${e}`));
    }
  },
};
