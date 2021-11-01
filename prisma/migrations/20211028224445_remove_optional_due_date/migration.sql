/*
  Warnings:

  - Made the column `dueDate` on table `CardMemoParams` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CardMemoParams" ALTER COLUMN "dueDate" SET NOT NULL;
