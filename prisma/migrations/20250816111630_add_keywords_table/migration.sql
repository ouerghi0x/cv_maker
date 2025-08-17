-- CreateTable
CREATE TABLE "Keywords" (
    "id" SERIAL NOT NULL,
    "cvid" INTEGER NOT NULL,
    "keywords" TEXT NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "Keywords_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Keywords_cvid_key" ON "Keywords"("cvid");

-- AddForeignKey
ALTER TABLE "Keywords" ADD CONSTRAINT "Keywords_cvid_fkey" FOREIGN KEY ("cvid") REFERENCES "CV"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
