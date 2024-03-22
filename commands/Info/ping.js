const { MessageEmbed } = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const { handlemsg, getRandomNum } = require(`../../handlers/functions`);
var cp = require("child_process");
const dash = `\n`;
module.exports = {
  name: "ping",
  category: "Info",
  aliases: ["latency"],
  cooldown: 2,
  usage: "ping",
  description: "Gives you information on how fast the Bot can respond to you",
  type: "bot",
  run: async (
    client,
    message,
    args,
    cmduser,
    text,
    prefix,
    player,
    es,
    ls,
    GuildSettings,
  ) => {
    try {
      let oldate = Math.floor(Date.now() / 10);
      message
        .reply({
          embeds: [
            new MessageEmbed()
              .setColor(es.color)
              .setThumbnail(
                es.thumb
                  ? es.footericon &&
                    (es.footericon.includes("http://") ||
                      es.footericon.includes("https://"))
                    ? es.footericon
                    : client.user.displayAvatarURL()
                  : null,
              )
              .setTitle(':heartbeat: Testing Connection Speed ...'),
          ],
        })
        .then(async (msg) => {
          let newtime = Math.floor(Math.floor(Date.now() / 10) - oldate);
          const dbping = await client.database.ping();
          console.log(`[${dbping}ms] | "ping" | DB PING RECEIVED`.brightRed);
          if (newtime < 0) newtime *= -1;
          msg
            .edit({
              embeds: [
                new MessageEmbed()
                  .setColor(es.color)
                  .setThumbnail(
                    es.thumb
                      ? es.footericon &&
                        (es.footericon.includes("http://") ||
                          es.footericon.includes("https://"))
                        ? es.footericon
                        : client.user.displayAvatarURL()
                      : null,
                  )
                  .setFooter(
                    client.getFooter(
                      "It Takes longer, because i am getting my host ping!" +
                        dash,
                      es.footericon &&
                        (es.footericon.includes("http://") ||
                          es.footericon.includes("https://"))
                        ? es.footericon
                        : client.user.displayAvatarURL(),
                    ),
                  )
                  .setTitle(`:robot: Bot Ping: \`{botping}ms\`\n\n\n<:online:1195335230551236688> Database Ping: \`${dbping}ms\``,),
              ],
            })
            .catch(console.error);
        });
    } catch (e) {
      console.log(String(e.stack).grey.bgRed);
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.erroroccur)
            .setDescription(
              eval(client.la[ls]["cmds"]["info"]["color"]["variable2"]),
            ),
        ],
      });
    }
  },
};
