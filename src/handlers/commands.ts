import { readdirSync } from "fs";
import chalk from "chalk";
import { calcProcessDurationTime } from "./functions";
import { ExtendedClient } from "../types";

const loadCommand = async (
  client: ExtendedClient,
  dir: string,
  file: string,
) => {
  try {
    // Dynamically import the command module
    const pull = (await import(`../commands/${dir}/${file}`)).Command;
    if (!pull) return;
    if (pull.name) {
      client.commands?.set(pull.name, pull);
      // console.log(`    | ${file} :: Ready`.brightGreen)
    } else {
      //console.log(`    | ${file} :: error -> missing a help.name,or help.name is not a string.`)
      return;
    }

    if (pull.aliases && Array.isArray(pull.aliases)) {
      pull.aliases.forEach((alias: string) =>
        client.aliases?.set(alias, pull.name),
      );
    }
  } catch (e) {
    client.sentry?.captureException(e);
    console.log(chalk.grey.bgRed(e));
  }
}

export const CommandManager = async (client: ExtendedClient): Promise<void> => {
  console.log(
    `${chalk.magenta("[x] :: ")}${chalk.greenBright("Now loading the Commands ...")}`,
  );
  const dateNow = process.hrtime();

  const commandsList: { name: string; description: string; type: number }[] =
    [];

  try {
    // Read command directories
    for (const dir of readdirSync("./src/commands/")) {
      try {
        const commandFiles = readdirSync(`./src/commands/${dir}/`).filter(
          (file) => file.endsWith(".ts"),
        );

        for (const file of commandFiles) {
          await loadCommand(client, dir, file);

          // Add command to the array for discordbotlist.com
          const pull = (await import(`../commands/${dir}/${file}`)).Command;
          if (pull && pull.name && pull.description) {
            commandsList.push({
              name: pull.name,
              description: pull.description,
              type: 1, // Assuming all commands are of type 1 (CHAT_INPUT)
            });
          }
        }
      } catch (e) {
        console.error(e);
        client.sentry?.captureException(e);
      }
    }

    console.log(
      chalk.magenta(`[x] :: `) +
      chalk.greenBright(
        `LOADED THE ${client.commands?.size} COMMANDS after: `,
      ) +
      chalk.green(`${calcProcessDurationTime(dateNow, false)}ms`),
    );
  } catch (e) {
    console.error(e);
    client.sentry?.captureException(e);
  }
}