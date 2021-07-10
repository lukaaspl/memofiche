/*
  Warnings:

  - A unique constraint covering the columns `[userId,name]` on the table `Deck` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Deck.name_userId_unique";

-- CreateIndex
CREATE UNIQUE INDEX "Deck.userId_name_unique" ON "Deck"("userId", "name");
