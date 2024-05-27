const { PrismaClient } = require("@prisma/client");
const { withAccelerate } = require("@prisma/extension-accelerate");

module.exports = async (client) => {
  return new Promise(async (res) => {
    let dateNow = Date.now();
    
    console.log(`${String("[x] :: ")}Now loading the Database ...`);
    client.prisma = new PrismaClient();

    console.log(
      `[x] :: ` + `LOADED THE DATABASE after: ` + `${Date.now() - dateNow}ms`,
    );

    client.game = client.prisma.GameData;
    client.user_data = client.prisma.UserData;

    let gamedata = await client.game.findUnique({
      where: {
        id: 1,
      },
    });
  });
};
