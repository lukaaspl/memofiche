-- CreateTable
CREATE TABLE "StudySession" (
    "id" SERIAL NOT NULL,
    "deckId" INTEGER NOT NULL,
    "studyTime" INTEGER NOT NULL,
    "avgTimePerCard" INTEGER NOT NULL,
    "avgRate" DECIMAL(65,30) NOT NULL,
    "studiedCards" INTEGER NOT NULL,
    "positiveCards" INTEGER NOT NULL,
    "negativeCards" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudySession_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StudySession" ADD CONSTRAINT "StudySession_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "Avatar_profileId_unique" RENAME TO "Avatar_profileId_key";

-- RenameIndex
ALTER INDEX "Profile_userId_unique" RENAME TO "Profile_userId_key";
