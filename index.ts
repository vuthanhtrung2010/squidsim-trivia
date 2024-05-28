import { Client, Intents } from 'discord.js';
import { config } from '@dotenvx/dotenvx';

config();

export const client = new Client({
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
  ],
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Intents.FLAGS.GUILD_WEBHOOKS,
    Intents.FLAGS.GUILD_INVITES,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
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

const requireHandlers = async (): Promise<void> => {
  const handlers = [
    "clientvariables",
    "command",
    "events",
    "loaddb",
    "update_data"
  ];

  for (const handler of handlers) {
    try {
      const handlerModule = await import(`./handlers/${handler}`);
      handlerModule.default(client);
    } catch (e) {
      console.error(e);
    }
  }
};

requireHandlers();

client.login(process.env.token);
