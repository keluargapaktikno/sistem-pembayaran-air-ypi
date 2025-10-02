/*
  Warnings:

  - A unique constraint covering the columns `[nomor_rekening]` on the table `Warga` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Warga" ADD COLUMN     "nomor_rekening" TEXT;

-- CreateTable
CREATE TABLE "public"."PencatatanMeter" (
    "id" TEXT NOT NULL,
    "periode_pencatatan" TIMESTAMP(3) NOT NULL,
    "meter_awal" INTEGER NOT NULL,
    "meter_akhir" INTEGER NOT NULL,
    "pemakaian" INTEGER NOT NULL,
    "foto_meter" TEXT,
    "dicatatPada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "wargaId" TEXT NOT NULL,
    "petugasId" TEXT NOT NULL,

    CONSTRAINT "PencatatanMeter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PencatatanMeter_wargaId_periode_pencatatan_key" ON "public"."PencatatanMeter"("wargaId", "periode_pencatatan");

-- CreateIndex
CREATE UNIQUE INDEX "Warga_nomor_rekening_key" ON "public"."Warga"("nomor_rekening");

-- AddForeignKey
ALTER TABLE "public"."PencatatanMeter" ADD CONSTRAINT "PencatatanMeter_wargaId_fkey" FOREIGN KEY ("wargaId") REFERENCES "public"."Warga"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PencatatanMeter" ADD CONSTRAINT "PencatatanMeter_petugasId_fkey" FOREIGN KEY ("petugasId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
