-- CreateTable
CREATE TABLE "UserData" (
    "id" SERIAL NOT NULL,
    "userID" TEXT NOT NULL,
    "wins" INTEGER NOT NULL,

    CONSTRAINT "UserData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameData" (
    "id" SERIAL NOT NULL,
    "lastQuestion" INTEGER NOT NULL,
    "isPlaying" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "GameData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserData_userID_key" ON "UserData"("userID");
