-- CreateTable
CREATE TABLE "Stat" (
    "id" TEXT NOT NULL,
    "lost" INTEGER NOT NULL,
    "commands" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Stat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserData" (
    "userID" TEXT NOT NULL,
    "wins" INTEGER NOT NULL,
    "badges" TEXT[],

    CONSTRAINT "UserData_pkey" PRIMARY KEY ("userID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stat_id_key" ON "Stat"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserData_userID_key" ON "UserData"("userID");

-- AddForeignKey
ALTER TABLE "Stat" ADD CONSTRAINT "Stat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserData"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;
