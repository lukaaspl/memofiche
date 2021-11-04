/*
  Warnings:

  - You are about to drop the column `isFavorite` on the `Tag` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Deck" ADD COLUMN     "isFavorite" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "isFavorite";
