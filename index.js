const Discord = require("discord.js");
require("@dotenvx/dotenvx").config();

const client = new Discord.Client({
  fetchAllMembers: false,
  restTimeOffset: 0,
  failIfNotExists: false,
  allowedMentions: {
    parse: ["users"],
    repliedUser: false,
  },
  partials: [
    "MESSAGE",
    "CHANNEL",
    "REACTION",
    "GUILD_MEMBER",
    "USER",
    "INTERACTION",
  ],
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Discord.Intents.FLAGS.GUILD_WEBHOOKS,
    Discord.Intents.FLAGS.GUILD_INVITES,
    Discord.Intents.FLAGS.GUILD_PRESENCES,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    //Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Discord.Intents.FLAGS.DIRECT_MESSAGES,
    Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    //Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING
  ],
  presence: {
    activities: [
      {
        name: "SquidSim (aka Sus Nation)",
        type: "WATCHING",
      },
    ],
    status: "online",
  },
});

async function requirehandlers() {
  // resolve promise
  for await (const handler of [
    "clientvariables",
    "command",
    "events",
    "loaddb",
    "update_data"
  ]) {
    try {
      await require(`./handlers/${handler}`)(client);
    } catch (e) {
      console.error(e);
    }
  }
}
requirehandlers();

client.login(process.env.token);
