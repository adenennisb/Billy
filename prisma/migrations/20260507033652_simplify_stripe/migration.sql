/*
  Warnings:

  - You are about to drop the column `stripeAccountId` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `stripeChargesEnabled` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `stripePayoutsEnabled` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `platformFeeCents` on the `Invoice` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Company" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "logoPath" TEXT,
    "address" TEXT,
    "stripeSecretKey" TEXT,
    "tosAcceptedAt" DATETIME,
    "tosAcceptedIp" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Company_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Company" ("address", "createdAt", "email", "id", "logoPath", "name", "tosAcceptedAt", "tosAcceptedIp", "userId") SELECT "address", "createdAt", "email", "id", "logoPath", "name", "tosAcceptedAt", "tosAcceptedIp", "userId" FROM "Company";
DROP TABLE "Company";
ALTER TABLE "new_Company" RENAME TO "Company";
CREATE UNIQUE INDEX "Company_userId_key" ON "Company"("userId");
CREATE UNIQUE INDEX "Company_email_key" ON "Company"("email");
CREATE TABLE "new_Invoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "dueDate" DATETIME,
    "notes" TEXT,
    "stripeInvoiceId" TEXT,
    "stripeInvoiceUrl" TEXT,
    "stripeInvoicePdfUrl" TEXT,
    "stripePaymentIntentId" TEXT,
    "publicToken" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Invoice_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Invoice_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Invoice" ("clientId", "companyId", "createdAt", "currency", "dueDate", "id", "notes", "number", "publicToken", "status", "stripeInvoiceId", "stripeInvoiceUrl", "stripePaymentIntentId") SELECT "clientId", "companyId", "createdAt", "currency", "dueDate", "id", "notes", "number", "publicToken", "status", "stripeInvoiceId", "stripeInvoiceUrl", "stripePaymentIntentId" FROM "Invoice";
DROP TABLE "Invoice";
ALTER TABLE "new_Invoice" RENAME TO "Invoice";
CREATE UNIQUE INDEX "Invoice_publicToken_key" ON "Invoice"("publicToken");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
