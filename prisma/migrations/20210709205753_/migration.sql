/*
  Warnings:

  - A unique constraint covering the columns `[name,userId]` on the table `Deck` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Deck.name_userId_unique" ON "Deck"("name", "userId");
