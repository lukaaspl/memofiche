/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `CardMemoParams` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CardMemoParams" DROP COLUMN "updatedAt",
ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
