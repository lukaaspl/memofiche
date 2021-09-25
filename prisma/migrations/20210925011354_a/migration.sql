/*
  Warnings:

  - You are about to drop the column `avatar` on the `Avatar` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Avatar" DROP COLUMN "avatar",
ADD COLUMN     "source" TEXT;
