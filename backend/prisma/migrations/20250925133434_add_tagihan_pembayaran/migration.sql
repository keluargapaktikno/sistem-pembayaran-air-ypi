-- CreateEnum
CREATE TYPE "public"."StatusPembayaran" AS ENUM ('BELUM_BAYAR', 'LUNAS', 'TERTUNDA');

-- CreateEnum
CREATE TYPE "public"."MetodePembayaran" AS ENUM ('TUNAI', 'TRANSFER_BANK');

-- CreateTable
CREATE TABLE "public"."Tagihan" (
    "id" TEXT NOT NULL,
    "nomor_tagihan" TEXT NOT NULL,
    "periode_tagihan" TIMESTAMP(3) NOT NULL,
    "jumlah_pemakaian_m3" INTEGER NOT NULL,
    "tarif_per_m3" DOUBLE PRECISION NOT NULL,
    "biaya_abonemen" DOUBLE PRECISION NOT NULL,
    "total_tagihan" DOUBLE PRECISION NOT NULL,
    "status_pembayaran" "public"."StatusPembayaran" NOT NULL DEFAULT 'BELUM_BAYAR',
    "tanggal_terbit" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tanggal_jatuh_tempo" TIMESTAMP(3) NOT NULL,
    "pencatatanMeterId" TEXT NOT NULL,
    "wargaId" TEXT NOT NULL,

    CONSTRAINT "Tagihan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Pembayaran" (
    "id" TEXT NOT NULL,
    "tagihanId" TEXT NOT NULL,
    "jumlah_bayar" DOUBLE PRECISION NOT NULL,
    "tanggal_bayar" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metode_pembayaran" "public"."MetodePembayaran" NOT NULL,
    "dicatatOlehId" TEXT NOT NULL,

    CONSTRAINT "Pembayaran_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tagihan_nomor_tagihan_key" ON "public"."Tagihan"("nomor_tagihan");

-- CreateIndex
CREATE UNIQUE INDEX "Tagihan_pencatatanMeterId_key" ON "public"."Tagihan"("pencatatanMeterId");

-- CreateIndex
CREATE UNIQUE INDEX "Pembayaran_tagihanId_key" ON "public"."Pembayaran"("tagihanId");

-- AddForeignKey
ALTER TABLE "public"."Tagihan" ADD CONSTRAINT "Tagihan_pencatatanMeterId_fkey" FOREIGN KEY ("pencatatanMeterId") REFERENCES "public"."PencatatanMeter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Tagihan" ADD CONSTRAINT "Tagihan_wargaId_fkey" FOREIGN KEY ("wargaId") REFERENCES "public"."Warga"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pembayaran" ADD CONSTRAINT "Pembayaran_tagihanId_fkey" FOREIGN KEY ("tagihanId") REFERENCES "public"."Tagihan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pembayaran" ADD CONSTRAINT "Pembayaran_dicatatOlehId_fkey" FOREIGN KEY ("dicatatOlehId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
