-- DropIndex
DROP INDEX "Company_email_key";

-- DropIndex
DROP INDEX "Company_userId_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "activeCompanyId" TEXT;

-- CreateIndex
CREATE INDEX "Company_userId_idx" ON "Company"("userId");
