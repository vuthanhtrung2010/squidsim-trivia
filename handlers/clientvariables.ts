import { readdirSync } from 'fs'

module.exports = (client) => {
  /**
   * @INFO
   * This will be all of our CLIENT VARIABLES for the commands as well as a cooldown system for each cmd!
   */
  client.commands = new Map(); //an collection (like a digital map(database)) for all your commands
  client.aliases = new Map(); //an collection for all your command-aliases
  client.categories = readdirSync("./commands/"); //load the categories asynchronusly
  client.cooldowns = new Map(); //an collection for cooldown commands of each user

  client.caches = new Map()

  // Ensure datas in in caches
  client.caches.set("isPlaying", false)
  client.caches.set("lastQuestion", 0)

  return;
};
