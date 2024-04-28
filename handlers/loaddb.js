const { Database } = require("quickmongo");
const { delay } = require("./functions");
const OS = require("os");
const { PrismaClient } = require("@prisma/client");

module.exports = async (client) => {
  return new Promise(async (res) => {
    const connectionOptions = {
      useUnifiedTopology: true,
      maxPoolSize: 100,
      minPoolSize: 50,
      writeConcern: "majority",
    };
    let mongoUri = process.env.mongoUri;
    // CACHE DURATION OPTIONS
    process.env.DB_cache_ping = 10_000; // Delete the cache after X ms | < 0 === never delete [DEFAULT: 60_000]
    process.env.DB_cache_get = 0; // Delete the cache after X ms | < 0 === never delete [DEFAULT: 300_000]
    process.env.DB_cache_all = 0; // Delete the cache after X ms | < 0 === never delete [DEFAULT: 600_000]
    // You can also add: db.get(key, true) // to force-fetch the db

    /*
            if you have several Pools, mongo can use them to send data to them without "blocking" the sending from other datas
            Aka it will be faster, but needs more ram...
        */
    let dateNow = Date.now();
    console.log(`${String("[x] :: ")}Now loading the Database ...`);
    client.prisma = new PrismaClient();
    client.database = new Database(mongoUri, connectionOptions);
    // when the db is ready
    client.database.on("ready", async () => {
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
