import { PrismaClient } from "@prisma/client";

module.exports = async (client) => {
  return new Promise(async (res) => {
    let dateNow = Date.now();

    console.log(`${String("[x] :: ")}Now loading the Database ...`);
    client.prisma = new PrismaClient();

    console.log(
      `[x] :: ` + `LOADED THE DATABASE after: ` + `${Date.now() - dateNow}ms`,
    );

    client.prisma.userData = client.prisma.UserData;
  });
};
