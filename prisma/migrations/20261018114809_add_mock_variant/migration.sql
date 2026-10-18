-- CreateTable
CREATE TABLE "MockVariant" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "questionIds" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MockVariant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MockVariant_number_key" ON "MockVariant"("number");
