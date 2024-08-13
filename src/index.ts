import { Client, GatewayIntentBits, Partials } from "discord.js";
import { config } from '@dotenvx/dotenvx';
import { ExtendedClient } from "./types";

import { ClientVar } from "./handlers/clientvariables";
import { CommandManager } from "./handlers/commands";
import { EventsManager } from "./handlers/events";
import { DatabaseManager } from "./handlers/loaddb";
import { init } from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

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

  if (process.env.MODE && process.env.MODE === "production") {
    try {
      client.sentry = init({
        dsn: process.env.SENTRY_DSN_ADDRESS,
        integrations: [
          // Add our Profiling integration
          nodeProfilingIntegration(),
        ],
        // Performance Monitoring
        tracesSampleRate: 1.0, // Capture 100% of the transactions
        profilesSampleRate: 1.0,
        environment: "production",
      });
    } catch (e) {
      console.error(e);
    }
  }
  
  await ClientVar(client);
  await CommandManager(client);
  await DatabaseManager(client);
  await EventsManager(client);

  await client.login(process.env.TOKEN);
})();
