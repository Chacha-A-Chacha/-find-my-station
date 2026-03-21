-- CreateTable
CREATE TABLE "counties" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "constituency_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "constituencies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "county_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "office_location" TEXT,
    "landmark" TEXT,
    "distance_to_office" TEXT,
    "verified_lat" REAL,
    "verified_lng" REAL,
    "verification_status" TEXT NOT NULL DEFAULT 'unverified',
    "confirmation_count" INTEGER NOT NULL DEFAULT 0,
    "verified_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "constituencies_county_id_fkey" FOREIGN KEY ("county_id") REFERENCES "counties" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "contributor_identities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "device_fingerprint" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "identity_type" TEXT NOT NULL,
    "contribution_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "contributions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "constituency_id" TEXT NOT NULL,
    "contributor_id" TEXT NOT NULL,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL,
    "cluster_id" TEXT,
    "device_fingerprint" TEXT NOT NULL,
    "ip_hash" TEXT NOT NULL,
    "is_confirmation" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "contributions_constituency_id_fkey" FOREIGN KEY ("constituency_id") REFERENCES "constituencies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "contributions_contributor_id_fkey" FOREIGN KEY ("contributor_id") REFERENCES "contributor_identities" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "flags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "constituency_id" TEXT NOT NULL,
    "device_fingerprint" TEXT NOT NULL,
    "reason" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "flags_constituency_id_fkey" FOREIGN KEY ("constituency_id") REFERENCES "constituencies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "counties_name_key" ON "counties"("name");

-- CreateIndex
CREATE UNIQUE INDEX "counties_slug_key" ON "counties"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "constituencies_slug_key" ON "constituencies"("slug");

-- CreateIndex
CREATE INDEX "constituencies_county_id_idx" ON "constituencies"("county_id");

-- CreateIndex
CREATE INDEX "constituencies_verification_status_idx" ON "constituencies"("verification_status");

-- CreateIndex
CREATE UNIQUE INDEX "contributor_identities_device_fingerprint_key" ON "contributor_identities"("device_fingerprint");

-- CreateIndex
CREATE INDEX "contributions_constituency_id_idx" ON "contributions"("constituency_id");

-- CreateIndex
CREATE INDEX "contributions_cluster_id_idx" ON "contributions"("cluster_id");

-- CreateIndex
CREATE UNIQUE INDEX "contributions_device_fingerprint_constituency_id_key" ON "contributions"("device_fingerprint", "constituency_id");

-- CreateIndex
CREATE INDEX "flags_constituency_id_idx" ON "flags"("constituency_id");

-- CreateIndex
CREATE UNIQUE INDEX "flags_device_fingerprint_constituency_id_key" ON "flags"("device_fingerprint", "constituency_id");
