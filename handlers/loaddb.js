const { Database } = require("quickmongo");
const { delay } = require("./functions");
const OS = require("os");
const { PrismaClient } = require("@prisma/client");

module.exports = async (client) => {
  return new Promise(async (res) => {
    let dateNow = Date.now();
    console.log(`${String("[x] :: ")}Now loading the Database ...`);
    client.prisma = new PrismaClient();
    console.log(
      `[x] :: ` + `LOADED THE DATABASE after: ` + `${Date.now() - dateNow}ms`
    );

    client.game = client.prisma.GameData;
    client.user_data = client.prisma.UserData;

    let gamedata = client.game.findUnique({
      where: {
        id: 1,
      },
    });

    if (!gamedata) {
      client.game.create({
        data: {
          isPlaying: false,
          lastQuestion: 0,
        },
      });
    } else {
      client.game.update({
        where: {
          id: 1,
        },
        data: {
          isPlaying: false,
          lastQuestion: 0,
        },
      });
    }
  });
};
