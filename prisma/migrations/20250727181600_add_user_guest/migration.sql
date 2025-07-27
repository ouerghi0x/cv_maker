-- CreateTable
CREATE TABLE "GuestUsage" (
    "id" SERIAL NOT NULL,
    "ip" TEXT NOT NULL,
    "fingerprint" TEXT,
    "location" TEXT,
    "hasCreatedCV" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "GuestUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GuestUsage_ip_key" ON "GuestUsage"("ip");

-- CreateIndex
CREATE INDEX "GuestUsage_ip_hasCreatedCV_idx" ON "GuestUsage"("ip", "hasCreatedCV");

-- CreateIndex
CREATE INDEX "GuestUsage_expiresAt_idx" ON "GuestUsage"("expiresAt");
