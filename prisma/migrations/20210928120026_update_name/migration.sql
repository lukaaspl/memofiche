/*
  Warnings:

  - You are about to drop the `CardMemoDetails` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CardMemoDetails" DROP CONSTRAINT "CardMemoDetails_cardId_fkey";

-- DropTable
DROP TABLE "CardMemoDetails";

-- CreateTable
CREATE TABLE "CardMemoParams" (
    "cardId" INTEGER NOT NULL,
    "repetitions" INTEGER NOT NULL,
    "easiness" DOUBLE PRECISION NOT NULL,
    "interval" INTEGER NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "CardMemoParams_cardId_key" ON "CardMemoParams"("cardId");

-- AddForeignKey
ALTER TABLE "CardMemoParams" ADD CONSTRAINT "CardMemoParams_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;
