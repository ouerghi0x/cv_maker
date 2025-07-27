-- CreateTable
CREATE TABLE "CV" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "cvType" TEXT NOT NULL,
    "jobPost" TEXT NOT NULL,
    "personalInfo" JSONB NOT NULL,
    "education" JSONB NOT NULL,
    "experience" JSONB NOT NULL,
    "skills" JSONB NOT NULL,
    "projects" JSONB NOT NULL,
    "certifications" JSONB NOT NULL,
    "languages" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CV_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CV" ADD CONSTRAINT "CV_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
