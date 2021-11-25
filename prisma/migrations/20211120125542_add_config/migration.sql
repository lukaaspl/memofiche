-- CreateTable
CREATE TABLE "Config" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "darkTheme" BOOLEAN NOT NULL DEFAULT false,
    "advancedRatingControls" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Config_userId_key" ON "Config"("userId");

-- AddForeignKey
ALTER TABLE "Config" ADD CONSTRAINT "Config_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
