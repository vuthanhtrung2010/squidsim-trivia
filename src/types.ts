import {
  ActionRow,
  ActionRowBuilder,
  CacheType,
  Client,
  Collection,
  Message,
  MessageComponentInteraction,
  User,
} from "discord.js";
import { PrismaClient } from "@prisma/client";
import { NodeClient } from "@sentry/node";

export interface ExtendedClient extends Client {
  commands?: Collection<string, MessageCommand>;
  aliases?: Map<string, string>;
  database?: PrismaClient;
  caches?: Map<string, any>;
  cooldowns?: Map<string, Collection<string, number>>;
  slashCommands?: Map<string, any>;
  sentry?: NodeClient;
  data?: {
    stats: {
      linesOfCode: number;
      lettersOfCode: number;
      files: number;
      MapAndSet: number;
    };
  };
  getUser?: (id: string) => Promise<User>;
}

export interface MessageCommand {
  name: string;
  category: string;
  aliases?: Array<string>;
  usage: string;
  description: string;
  cooldown: number;
  type?: string;
  memberpermissions?: Array<bigint>;
  run: (
    client: ExtendedClient,
    message: Message,
    args: Array<string>,
    prefix: string,
  ) => Promise<void> | void | Message | Promise<Message>;
} // MessageCommands Interface

export interface ClientEvent {
  name: string;
  run: (...args: any[]) => Promise<void> | void;
} // Events Interface

// Embeds
export interface Embed {
  title?: string;
  description?: string;
  url: string;
  color: string | number;
  fields: Fields[];
  thumbnail?: { url: string };
  image?: { url: string };
  timestamp?: Date;
  footer?: {
    text: string;
    icon_url: string;
  };
}

export interface Fields {
  name: string;
  value: string;
  inline?: boolean;
}

export interface InviteJson {
  code: string;
  uses: number | null;
  maxUses: number | null;
  inviter: User | null;
  createdTimestamp: number | null;
}

export interface Payload {
  content?: string;
  embeds: Embed[];
}

export type AnyCommand = MessageCommand;
