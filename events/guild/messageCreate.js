const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

// Here the event starts
module.exports = async (client, message) => {
  try {
    let dbEvent = Date.now();

    // If the message is not in a guild (aka in dms) or is from a webhook, ignore it
    if (
      !message.guild ||
      message.guild.available === false ||
      !message.channel ||
      message.webhookId
    )
      return;

    // If the channel is partial, fetch it
    if (message.channel?.partial) await message.channel.fetch().catch(() => {});
    if (message.member?.partial) await message.member.fetch().catch(() => {});

    const prefix = "!";

    if (message.author?.bot) return;

    // Regular expression to match the defined prefix
    const prefixRegex = new RegExp(`^${prefix}\\s*`);

    // Check if the message starts with the prefix
    if (!prefixRegex.test(message.content)) return;

    // Extract the matched prefix from the message content
    const matchedPrefix = prefix;

    // Check permissions
    const requiredPermissions = [
      Discord.Permissions.FLAGS.SEND_MESSAGES,
      Discord.Permissions.FLAGS.USE_EXTERNAL_EMOJIS,
      Discord.Permissions.FLAGS.EMBED_LINKS,
      Discord.Permissions.FLAGS.ADD_REACTIONS,
    ];
    const missingPermissions = requiredPermissions.filter(
      (perm) => !message.guild.me.permissions.has(perm),
    );
    if (missingPermissions.length > 0) {
      const missing = missingPermissions
        .map((perm) => `**${perm}**`)
        .join(", ");
      return message
        .reply(`:x: **I am missing the following permissions: ${missing}**`)
        .catch(console.error);
    }

    // Create the arguments by slicing off the prefix length
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);

    // Creating the command argument by shifting the args by 1
    const cmd = args.shift()?.toLowerCase();

    // If no command is added, return an error
    if (!cmd) {
      if (matchedPrefix.includes(client.user.id))
        return message
          .reply({
            embeds: [
              new Discord.MessageEmbed()
                .setColor(es.color)
                .setTitle(
                  `<a:yes:958653519513133078> **To see all Commands type: \`${prefix}help\`!**`,
                ),
            ],
          })
          .catch(console.error);
      return;
    }

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
              new Discord.MessageEmbed()
                .setColor("RED")
                .setAuthor({
                  name: message.member.user.tag,
                  iconURL:
                    message.member.user.displayAvatarURL({
                      dynamic: true,
                      size: 64,
                    }) || message.member.user.defaultAvatarURL,
                  url: "https://links.trung.is-a.dev",
                })
                .setDescription(
                  `<:no:948483017993769041> Please wait ${formattedTimeLeft} more second(s) before reusing the \`${command.name}\` command.`,
                ),
            ],
          })
          .catch(console.error);
      }
    }

    // Set cooldown for the user
    timestamps.set(message.author?.id, now);
    setTimeout(() => timestamps.delete(message.author?.id), cooldownAmount);

    // Execute the command
    command.run(client, message, args, message.member, args.join(" "), prefix);
  } catch (e) {
    console.log(e.stack);
    return message
      .reply({
        embeds: [
          new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle("Errored!")
            .setDescription(`\`\`\`${e.message}\`\`\``),
        ],
      })
      .then(async (msg) => {
        setTimeout(() => {
          try {
            msg.delete().catch(console.error);
          } catch {}
        }, 5000);
      })
      .catch(console.error);
  }
};
