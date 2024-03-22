const { readdirSync } = require("fs");
const { MessageEmbed } = require("discord.js");
const ee = require(`${process.cwd()}/botconfig/embed.json`);
console.log(
  "Welcome to SERVICE HANDLER /--/ By https://trung.is-a.dev /--/ Discord: trungisreal",
);
module.exports = (client) => {
  let dateNow = Date.now();
  console.log(
    `${String("[x] :: ")}Now loading the Commands ...`,
  );
  try {
    readdirSync("./commands/").forEach((dir) => {
      const commands = readdirSync(`./commands/${dir}/`).filter((file) =>
        file.endsWith(".js"),
      );
      for (let file of commands) {
        try {
          let pull = require(`../commands/${dir}/${file}`);
          if (pull.name) {
            client.commands.set(pull.name, pull);
            //console.log(`    | ${file} :: Ready`)
          } else {
            //console.log(`    | ${file} :: error -> missing a help.name,or help.name is not a string.`)
            continue;
          }
          if (pull.aliases && Array.isArray(pull.aliases))
            pull.aliases.forEach((alias) =>
              client.aliases.set(alias, pull.name),
            );
        } catch (e) {
          console.log(String(e.stack));
        }
      }
    });
  } catch (e) {
    console.log(String(e.stack));
  }

  console.log(
    `[x] :: ` +
      `LOADED THE ${client.commands.size} COMMANDS after: ` +
      `${Date.now() - dateNow}ms`,
  );
};
