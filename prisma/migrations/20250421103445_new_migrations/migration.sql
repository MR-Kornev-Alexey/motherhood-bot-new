-- AlterTable
ALTER TABLE "telegrams" ADD COLUMN     "privider" TEXT NOT NULL DEFAULT 'motherhood';

-- CreateTable
CREATE TABLE "Links" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "descriptionFormat" TEXT NOT NULL DEFAULT 'plaintext',
    "date" TEXT NOT NULL,
    "link" TEXT NOT NULL,

    CONSTRAINT "Links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "link_id" TEXT NOT NULL,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Favorite_user_id_idx" ON "Favorite"("user_id");

-- CreateIndex
CREATE INDEX "Favorite_link_id_idx" ON "Favorite"("link_id");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_user_id_link_id_key" ON "Favorite"("user_id", "link_id");

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_link_id_fkey" FOREIGN KEY ("link_id") REFERENCES "Links"("id") ON DELETE CASCADE ON UPDATE CASCADE;
