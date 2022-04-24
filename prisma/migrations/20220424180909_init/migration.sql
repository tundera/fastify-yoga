/*
  Warnings:

  - You are about to drop the column `teamId` on the `ColorScheme` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ColorScheme" DROP CONSTRAINT "ColorScheme_teamId_fkey";

-- DropIndex
DROP INDEX "ColorScheme_teamId_key";

-- AlterTable
ALTER TABLE "ColorScheme" DROP COLUMN "teamId";

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "colorSchemeId" TEXT;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_colorSchemeId_fkey" FOREIGN KEY ("colorSchemeId") REFERENCES "ColorScheme"("id") ON DELETE SET NULL ON UPDATE CASCADE;
