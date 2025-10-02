-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'PETUGAS_PENCATAT', 'WARGA');

-- CreateEnum
CREATE TYPE "public"."StatusHuni" AS ENUM ('PEMILIK', 'PENGONTRAK');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'WARGA',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Warga" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nama_lengkap" TEXT NOT NULL,
    "blok" TEXT NOT NULL,
    "nomor_rumah" TEXT NOT NULL,
    "nomor_telepon" TEXT NOT NULL,
    "status_huni" "public"."StatusHuni" NOT NULL DEFAULT 'PEMILIK',
    "isAktif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Warga_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Warga_userId_key" ON "public"."Warga"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Warga_nomor_telepon_key" ON "public"."Warga"("nomor_telepon");

-- CreateIndex
CREATE UNIQUE INDEX "Warga_blok_nomor_rumah_key" ON "public"."Warga"("blok", "nomor_rumah");

-- AddForeignKey
ALTER TABLE "public"."Warga" ADD CONSTRAINT "Warga_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
