-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ACCOUNTANT', 'CEO');

-- CreateEnum
CREATE TYPE "PaymentPlatform" AS ENUM ('WHOP', 'AIRWALLEX', 'SLASH', 'PAYONEER', 'WIO_BANK', 'MAMO', 'KRAKEN');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'HKD', 'PKR');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('LOCAL', 'INTERNATIONAL');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "UserRole";

-- CreateTable
CREATE TABLE "Clients" (
    "id" TEXT NOT NULL,
    "clientName" TEXT NOT NULL DEFAULT '',
    "totalRevenue" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "currencyType" "Currency",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "clientName" TEXT NOT NULL DEFAULT '',
    "saleAmount" DECIMAL(12,2) NOT NULL DEFAULT 0.0,
    "paymentPlatform" "PaymentPlatform" NOT NULL DEFAULT 'WHOP',
    "currency" "Currency" NOT NULL DEFAULT 'USD',
    "saleDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "refId" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankAccount" (
    "id" TEXT NOT NULL,
    "bankName" TEXT NOT NULL DEFAULT '',
    "accountType" "AccountType" NOT NULL DEFAULT 'LOCAL',
    "currencyType" "Currency" NOT NULL DEFAULT 'PKR',
    "amount" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Clients_clientName_idx" ON "Clients"("clientName");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_refId_key" ON "Transaction"("refId");

-- CreateIndex
CREATE INDEX "Transaction_clientId_idx" ON "Transaction"("clientId");

-- CreateIndex
CREATE INDEX "Transaction_saleDate_idx" ON "Transaction"("saleDate");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
