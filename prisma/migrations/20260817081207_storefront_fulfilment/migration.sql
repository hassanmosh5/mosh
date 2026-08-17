-- CreateEnum
CREATE TYPE "SalesPlatform" AS ENUM ('GUMROAD', 'SELAR', 'SHOPIFY', 'PAYSTACK', 'WHATSAPP', 'MANUAL');

-- CreateEnum
CREATE TYPE "SaleStatus" AS ENUM ('PAID', 'REFUNDED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Sale" (
    "id" TEXT NOT NULL,
    "platform" "SalesPlatform" NOT NULL,
    "reference" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "productSlug" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "amountMinor" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "status" "SaleStatus" NOT NULL DEFAULT 'PAID',
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DownloadGrant" (
    "id" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "productSlug" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "maxDownloads" INTEGER NOT NULL,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DownloadGrant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DownloadEvent" (
    "id" TEXT NOT NULL,
    "grantId" TEXT NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DownloadEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Sale_email_idx" ON "Sale"("email");

-- CreateIndex
CREATE INDEX "Sale_productSlug_createdAt_idx" ON "Sale"("productSlug", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Sale_platform_reference_key" ON "Sale"("platform", "reference");

-- CreateIndex
CREATE UNIQUE INDEX "DownloadGrant_tokenHash_key" ON "DownloadGrant"("tokenHash");

-- CreateIndex
CREATE INDEX "DownloadGrant_saleId_idx" ON "DownloadGrant"("saleId");

-- CreateIndex
CREATE INDEX "DownloadGrant_expiresAt_idx" ON "DownloadGrant"("expiresAt");

-- CreateIndex
CREATE INDEX "DownloadEvent_grantId_createdAt_idx" ON "DownloadEvent"("grantId", "createdAt");

-- AddForeignKey
ALTER TABLE "DownloadGrant" ADD CONSTRAINT "DownloadGrant_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownloadEvent" ADD CONSTRAINT "DownloadEvent_grantId_fkey" FOREIGN KEY ("grantId") REFERENCES "DownloadGrant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
