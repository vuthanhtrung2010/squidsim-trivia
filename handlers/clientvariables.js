const Discord = require("discord.js");
const fs = require("fs");
module.exports = (client) => {
  /**
   * @INFO
   * This will be all of our CLIENT VARIABLES for the commands as well as a cooldown system for each cmd!
   */
  client.commands = new Map(); //an collection (like a digital map(database)) for all your commands
  client.aliases = new Map(); //an collection for all your command-aliases
  client.categories = fs.readdirSync("./commands/"); //load the categories asynchronusly
  client.cooldowns = new Map(); //an collection for cooldown commands of each user

  client.caches = new Map()

  client.caches.set("isPlaying", false)
  client.caches.set("lastQuestion", 0)

  return;
};
