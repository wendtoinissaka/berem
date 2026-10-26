-- CreateTable
CREATE TABLE "QuoteActivity" (
    "id" TEXT NOT NULL,
    "quoteRequestId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "oldStatus" "QuoteStatus",
    "newStatus" "QuoteStatus",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuoteActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QuoteActivity_quoteRequestId_createdAt_idx" ON "QuoteActivity"("quoteRequestId", "createdAt");

-- AddForeignKey
ALTER TABLE "QuoteActivity" ADD CONSTRAINT "QuoteActivity_quoteRequestId_fkey" FOREIGN KEY ("quoteRequestId") REFERENCES "QuoteRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
