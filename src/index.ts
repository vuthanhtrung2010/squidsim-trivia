import { Client, GatewayIntentBits, Partials } from "discord.js";
import { config } from '@dotenvx/dotenvx';
import { ExtendedClient } from "./types";

import { ClientVar } from "./handlers/clientvariables";
import { CommandManager } from "./handlers/commands";
import { EventsManager } from "./handlers/events";
import { DatabaseManager } from "./handlers/loaddb";
import { DataManager } from "./handlers/update_data";

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
  
  await ClientVar(client);
  await CommandManager(client);
  await DatabaseManager(client);
  await EventsManager(client);
  await DataManager(client);

  await client.login(process.env.TOKEN);
})();
