import Discord, { Message, PermissionsBitField } from "discord.js";
import { ClientEvent, ExtendedClient } from "../../types";

export const Event: ClientEvent = {
  name: "messageCreate",
  run: async (message: Message, client: ExtendedClient): Promise<any> => {
    try {
      // If the message is not in a guild (aka in dms) or is from a webhook, ignore it
      if (
        !message.guild ||
        message.guild.available === false ||
        !message.channel ||
        message.webhookId
      )
        return;

      // If the channel is partial, fetch it
      if (message.channel?.partial)
        await message.channel.fetch().catch((e) => {
          client.sentry?.captureException(e);
        });
      if (message.member?.partial)
        await message.member.fetch().catch((e) => {
          client.sentry?.captureException(e);
        });

      const prefix = "!";

      if (message.author?.bot) return;

      // Regular expression to match the defined prefix
      const prefixRegex = new RegExp(`^${prefix}\\s*`);

      // Check if the message starts with the prefix
      if (!prefixRegex.test(message.content)) return;

      // Extract the matched prefix from the message content
      const matchedPrefix = prefix;

      // Check bot permissions
      const requiredPermissions = [
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.UseExternalEmojis,
        PermissionsBitField.Flags.EmbedLinks,
        PermissionsBitField.Flags.AddReactions,
      ];
      const missingPermissions = requiredPermissions.filter(
        (perm) => !message.guild.members.me.permissions.has(perm),
      );
      if (missingPermissions.length > 0) {
        const missing = missingPermissions
          .map((perm) => `**${perm}**`)
          .join(", ");
        return message
          .reply(`:x: **I am missing the following permissions: ${missing}**`)
          .catch((e) => {
            client.sentry?.captureException(e);
            console.error(e);
          });
      }

      // Create the arguments by slicing off the prefix length
      const args = message.content
        .slice(matchedPrefix.length)
        .trim()
        .split(/ +/);

      // Creating the command argument by shifting the args by 1
      const cmd = args.shift()?.toLowerCase();

      // If no command is added, return an error
      if (!cmd) return;

      // Get the command from the collection
      let command = client.commands.get(cmd);

      // If the command does not exist, try to get it by its alias
      if (!command) command = client.commands.get(client.aliases.get(cmd));

      if (!command) return; // Command not found, ignore it

      if (!client.cooldowns.has(command.name)) {
        // If it's not in the cooldown, set it there
        client.cooldowns.set(command.name, new Discord.Collection());
      }
      const now = Date.now(); // Get the current time
      const timestamps = client.cooldowns.get(command.name); // Get the timestamp of the last used commands
      const cooldownAmount = (command.cooldown || 1) * 1000; // Get the cooldown amount of the command

      // Check if the guild ID is not SquidSim or Test Server.
      if (
        !(
          message.guild.id === "901533988382998618" ||
          message.guild.id === "1220234130634178591"
        )
      ) {
        return message.channel.send({
          content:
            "You can only use commands in SquidSim a.k.a [SuS Nation](https://discord.gg/squidsim)",
        });
      }

      if (
        command.category === "Owner" &&
        message.author.id !== "1139406664584409159"
      )
        return;
      if (timestamps.has(message.author?.id)) {
        // If the user is on cooldown
        const expirationTime =
          timestamps.get(message.author?.id) + cooldownAmount;
        if (now < expirationTime) {
          const timeLeftInMilliseconds = expirationTime - now;
          const formattedTimeLeft = `<t:${Math.floor(now / 1000) + Math.floor(timeLeftInMilliseconds / 1000)}:R>`;
          return message
            .reply({
              embeds: [
                new Discord.EmbedBuilder()
                  .setColor("Red")
                  .setAuthor({
                    name: message.member.user.tag,
                    iconURL:
                      message.member.user.displayAvatarURL({
                        size: 64,
                      }) || message.member.user.defaultAvatarURL,
                    url: "https://links.trung.is-a.dev",
                  })
                  .setDescription(
                    `<:no:948483017993769041> Please wait ${formattedTimeLeft} more second(s) before reusing the \`${command.name}\` command.`,
                  ),
              ],
            })
            .catch((e) => {
              client.sentry?.captureException(e);
              console.error(e);
            });
        }
      }

      // Set cooldown for the user
      timestamps.set(message.author?.id, now);
      setTimeout(() => timestamps.delete(message.author?.id), cooldownAmount);

      // Execute the command
      command.run(client, message, args, prefix);
    } catch (e) {
      client.sentry?.captureException(e);
      console.log(e.stack);
      return message
        .reply({
          embeds: [
            new Discord.EmbedBuilder()
              .setColor("Red")
              .setTitle("Errored!")
              .setDescription(`\`\`\`${e.message}\`\`\``),
          ],
        })
        .then(async (msg) => {
          setTimeout(() => {
            try {
              msg.delete().catch((e) => {
                client.sentry?.captureException(e);
                console.error(e);
              });
            } catch (e) {
              client.sentry?.captureException(e);
              console.error(e);
            }
          }, 5000);
        })
        .catch((e) => {
          client.sentry?.captureException(e);
          console.error(e);
        });
    }
  },
};
