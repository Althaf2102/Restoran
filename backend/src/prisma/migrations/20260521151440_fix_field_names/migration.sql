/*
  Warnings:

  - You are about to drop the `menu_bahan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stok_bahan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `menu_bahan` DROP FOREIGN KEY `menu_bahan_bahan_id_fkey`;

-- DropForeignKey
ALTER TABLE `menu_bahan` DROP FOREIGN KEY `menu_bahan_menu_id_fkey`;

-- DropTable
DROP TABLE `menu_bahan`;

-- DropTable
DROP TABLE `stok_bahan`;

-- CreateTable
CREATE TABLE `Pembayaran` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `metode` ENUM('TUNAI', 'QRIS', 'TRANSFER_BANK') NOT NULL,
    `totalBayar` DECIMAL(10, 2) NOT NULL,
    `kembalian` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `waktuBayar` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `pesananId` INTEGER NOT NULL,

    UNIQUE INDEX `Pembayaran_pesananId_key`(`pesananId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Pembayaran` ADD CONSTRAINT `Pembayaran_pesananId_fkey` FOREIGN KEY (`pesananId`) REFERENCES `pesanan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
