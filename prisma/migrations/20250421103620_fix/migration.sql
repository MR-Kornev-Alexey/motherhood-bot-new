/*
  Warnings:

  - You are about to drop the column `privider` on the `telegrams` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "telegrams" DROP COLUMN "privider",
ADD COLUMN     "provider" TEXT NOT NULL DEFAULT 'motherhood';
