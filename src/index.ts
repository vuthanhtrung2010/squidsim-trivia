import { Client, GatewayIntentBits, Partials } from "discord.js";
import { readdirSync } from "fs";
import { config } from '@dotenvx/dotenvx';
import { ExtendedClient } from "./types";

config();

(async () => {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.DirectMessageReactions,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.GuildWebhooks,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildInvites,
    ],
    partials: [Partials.Channel],
  }) as ExtendedClient;
  
  await client.login(process.env.TOKEN);
})();
