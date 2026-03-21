-- CreateTable
CREATE TABLE "feature_suggestions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'other',
    "file_url" TEXT,
    "contact" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "feature_suggestions_status_idx" ON "feature_suggestions"("status");

-- CreateIndex
CREATE INDEX "feature_suggestions_created_at_idx" ON "feature_suggestions"("created_at");
