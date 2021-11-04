-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "note" TEXT;

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "isFavorite" BOOLEAN NOT NULL DEFAULT false;
