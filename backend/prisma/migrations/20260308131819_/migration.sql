-- CreateTable
CREATE TABLE "JournalEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audioPath" TEXT NOT NULL,
    "transcript" TEXT NOT NULL,
    "mood" INTEGER NOT NULL,
    "sleepHours" REAL NOT NULL,
    "energy" INTEGER NOT NULL,
    "gym" BOOLEAN NOT NULL,
    "reading" BOOLEAN NOT NULL,
    "prayer" BOOLEAN NOT NULL,
    "deepWork" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "JournalSummary" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "entryId" TEXT NOT NULL,
    "highlights" TEXT NOT NULL,
    "lessons" TEXT NOT NULL,
    "improvements" TEXT NOT NULL,
    "nextActions" TEXT NOT NULL,
    CONSTRAINT "JournalSummary_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "JournalEntry" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "JournalSummary_entryId_key" ON "JournalSummary"("entryId");
