-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_deckId_fkey";

-- DropForeignKey
ALTER TABLE "CardMemoDetails" DROP CONSTRAINT "CardMemoDetails_cardId_fkey";

-- DropForeignKey
ALTER TABLE "Deck" DROP CONSTRAINT "Deck_userId_fkey";

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardMemoDetails" ADD CONSTRAINT "CardMemoDetails_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deck" ADD CONSTRAINT "Deck_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "CardMemoDetails.cardId_unique" RENAME TO "CardMemoDetails_cardId_key";

-- RenameIndex
ALTER INDEX "Deck.userId_name_unique" RENAME TO "Deck_userId_name_key";

-- RenameIndex
ALTER INDEX "Profile.avatarId_unique" RENAME TO "Profile_avatarId_key";

-- RenameIndex
ALTER INDEX "Tag.name_unique" RENAME TO "Tag_name_key";

-- RenameIndex
ALTER INDEX "User.email_unique" RENAME TO "User_email_key";

-- RenameIndex
ALTER INDEX "User.profileId_unique" RENAME TO "User_profileId_key";
