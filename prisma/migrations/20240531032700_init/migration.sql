/*
  Warnings:

  - The primary key for the `UserData` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `UserData` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserData" DROP CONSTRAINT "UserData_pkey",
DROP COLUMN "id",
ADD COLUMN     "badges" TEXT[],
ADD CONSTRAINT "UserData_pkey" PRIMARY KEY ("userID");

-- CreateTable
CREATE TABLE "Stat" (
    "id" SERIAL NOT NULL,
    "lost" INTEGER NOT NULL,
    "commands" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Stat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Stat" ADD CONSTRAINT "Stat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserData"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;
