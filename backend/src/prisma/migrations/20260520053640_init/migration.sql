-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('admin', 'kasir', 'pelanggan') NOT NULL DEFAULT 'pelanggan',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `menus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_menu` VARCHAR(100) NOT NULL,
    `kategori` ENUM('makanan', 'minuman') NOT NULL,
    `deskripsi` TEXT NULL,
    `harga` DECIMAL(10, 2) NOT NULL,
    `foto` VARCHAR(255) NULL,
    `stok` INTEGER NOT NULL DEFAULT 0,
    `tersedia` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pesanan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kode_pesanan` VARCHAR(30) NOT NULL,
    `pelanggan_id` INTEGER NULL,
    `nama_pelanggan` VARCHAR(100) NOT NULL,
    `total_harga` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('baru', 'diproses', 'selesai', 'dibatalkan') NOT NULL DEFAULT 'baru',
    `catatan` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `pesanan_kode_pesanan_key`(`kode_pesanan`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detail_pesanan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pesanan_id` INTEGER NOT NULL,
    `menu_id` INTEGER NOT NULL,
    `jumlah` INTEGER NOT NULL,
    `harga_saat_ini` DECIMAL(10, 2) NOT NULL,
    `subtotal` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stok_bahan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_bahan` VARCHAR(100) NOT NULL,
    `satuan` VARCHAR(20) NOT NULL,
    `stok_saat_ini` DECIMAL(10, 2) NOT NULL,
    `stok_minimum` DECIMAL(10, 2) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `menu_bahan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `menu_id` INTEGER NOT NULL,
    `bahan_id` INTEGER NOT NULL,
    `jumlah_digunakan` DECIMAL(10, 2) NOT NULL,
    `satuan` VARCHAR(20) NOT NULL,

    UNIQUE INDEX `menu_bahan_menu_id_bahan_id_key`(`menu_id`, `bahan_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pesanan` ADD CONSTRAINT `pesanan_pelanggan_id_fkey` FOREIGN KEY (`pelanggan_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_pesanan` ADD CONSTRAINT `detail_pesanan_pesanan_id_fkey` FOREIGN KEY (`pesanan_id`) REFERENCES `pesanan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_pesanan` ADD CONSTRAINT `detail_pesanan_menu_id_fkey` FOREIGN KEY (`menu_id`) REFERENCES `menus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `menu_bahan` ADD CONSTRAINT `menu_bahan_menu_id_fkey` FOREIGN KEY (`menu_id`) REFERENCES `menus`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `menu_bahan` ADD CONSTRAINT `menu_bahan_bahan_id_fkey` FOREIGN KEY (`bahan_id`) REFERENCES `stok_bahan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
