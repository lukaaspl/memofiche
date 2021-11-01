/*
  Warnings:

  - You are about to alter the column `avgRate` on the `StudySession` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "StudySession" ALTER COLUMN "avgRate" SET DATA TYPE DOUBLE PRECISION;
