-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "idkeywords" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "logo_url" TEXT,
    "link" TEXT,
    "newDescription" TEXT,
    "score" INTEGER,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Job_idkeywords_key" ON "Job"("idkeywords");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_idkeywords_fkey" FOREIGN KEY ("idkeywords") REFERENCES "Keywords"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
