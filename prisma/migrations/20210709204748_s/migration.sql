/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Deck` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Deck.userId_name_unique";

-- CreateIndex
CREATE UNIQUE INDEX "Deck.name_unique" ON "Deck"("name");
