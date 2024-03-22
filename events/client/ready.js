//here the event starts
const Discord = require("discord.js");
module.exports = async (client) => {
  //SETTING ALL GUILD DATA FOR THE DJ ONLY COMMANDS for the DEFAULT
  //client.guilds.cache.forEach(guild=>client.settings.set(guild.id, ["autoplay", "clearqueue", "forward", "loop", "jump", "loopqueue", "loopsong", "move", "pause", "resume", "removetrack", "removedupe", "restart", "rewind", "seek", "shuffle", "skip", "stop", "volume"], "djonlycmds"))
  try {
    try {
      const stringlength = 69;
      console.log("\n");
      console.log(
        `     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`
          ,
      );
      console.log(
        `     ┃ ` +
          " ".repeat(-1 + stringlength - ` ┃ `.length) +
          "┃",
      );
      console.log(
        `     ┃ ` +
          `Discord Bot is online!` +
          " ".repeat(
            -1 + stringlength - ` ┃ `.length - `Discord Bot is online!`.length,
          ) +
          "┃",
      );
      console.log(
        `     ┃ ` +
          ` /--/ ${client.user.tag} /--/ ` +
          " ".repeat(
            -1 +
              stringlength -
              ` ┃ `.length -
              ` /--/ ${client.user.tag} /--/ `.length,
          ) +
          "┃",
      );
      console.log(
        `     ┃ ` +
          " ".repeat(-1 + stringlength - ` ┃ `.length) +
          "┃",
      );
      console.log(
        `     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`
          ,
      );
    } catch {
      /* */
    }
    console.table({
      //'info': `${client.guilds.cache.get("773668217163218944")?.name} SERVER`,
      "Bot User:": `${client.user.tag}`,
      "Guild(s):": `${client.guilds.cache.size} Servers`,
      "Watching:": `${client.guilds.cache.reduce((a, b) => a + b?.memberCount, 0)} Members`,
      "Prefix:": `!`,
      "Commands:": `${client.commands.size}`,
      "Discord.js:": `v${Discord.version}`,
      "Node.js:": `${process.version}`,
      "Plattform:": `${process.platform} ${process.arch}`,
      "Memory:": `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`,
    });
  } catch (e) {
    console.log(String(e.stack));
  }
};
