const { Database } = require("quickmongo");
const { delay } = require("./functions");
const OS = require("os");
require('dotenv').config()

module.exports = async (client) => {
  return new Promise(async (res) => {
    const connectionOptions = {
      useUnifiedTopology: true,
      maxPoolSize: 100,
      minPoolSize: 50,
      writeConcern: "majority",
    };
    let mongoUri = process.env.mongoUri
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
    console.log(
      `${String("[x] :: ")}Now loading the Database ...`,
    );
    client.database = new Database(mongoUri, connectionOptions);
    // when the db is ready
    client.database.on("ready", async () => {
      const DbPing = await client.database.ping();
      console.log(
        `[x] :: ` +
          `LOADED THE DATABASE after: ` +
          `${Date.now() - dateNow}ms\n       Database got a ${DbPing}ms ping`
            ,
      );

      client.ownersettingsdb = new client.database.table("ownersettings");
      client.game = new client.database.table("game");
      client.user_data = new client.database.table("userdatadb");

      client.game.set(`game.game`, false)
    });

    var errortrys = 0;
    client.database.on("error", async () => {
      console.log("DB ERRORED");
      errortrys++;
      if (errortrys == 5)
        return console.log(`Can't reconnect, it's above try limimt`);
      await delay(2_000);
      await client.database.connect();
    });

    var closetrys = 0;
    client.database.on("close", async () => {
      console.log("DB CLOSED");
      closetrys++;
      if (closetrys == 5)
        return console.log(`Can't reconnect, it's above try limimt`);
      await delay(2_000);
      await client.database.connect();
    });

    var disconnecttrys = 0;
    client.database.on("disconnected", async () => {
      console.log("DB DISCONNECTED");
      disconnecttrys++;
      if (disconnecttrys == 5)
        return console.log(`Can't reconnect, it's above try limimt`);
      await delay(2_000);
      await client.database.connect();
    });

    // top-level awaits
    await client.database.connect();
  });
};
