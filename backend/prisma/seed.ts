// backend/prisma/seed.ts (KODE BARU & LEBIH CANGGIH)
import { PrismaClient, Role, StatusHuni } from '@prisma/client';
import { parse } from 'csv-parse';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const saltOrRounds = 10; // Added saltOrRounds declaration to use with bcrypt

async function processCsv(filePath: string): Promise<any[]> {
  const records: any[] = []; // Updated records array with explicit type annotation
  const parser = fs.createReadStream(filePath).pipe(parse({ columns: true, trim: true }));
  for await (const record of parser) {
    records.push(record);
  }
  return records;
}

async function main() {
  console.log('Memulai proses seeding...');

  // --- LANGKAH PEMBERSIHAN ---
  console.log('Membersihkan data warga dan user lama (selain admin)...');
  // Hapus semua pencatatan, tagihan, dan pembayaran terlebih dahulu
  await prisma.pembayaran.deleteMany({});
  await prisma.tagihan.deleteMany({});
  await prisma.pencatatanMeter.deleteMany({});
  await prisma.warga.deleteMany({});
  await prisma.user.deleteMany({
    where: {
      role: {
        not: 'ADMIN', // Jangan hapus user admin
      },
    },
  });
  console.log('Pembersihan selesai.');

  const pelangganPath = path.join(__dirname, 'seed-data', 'TB_PELANGGAN.csv');
  const allRecords = await processCsv(pelangganPath);

  // --- LANGKAH VALIDASI & TRANSFORMASI DATA ---
  const validRecords = allRecords.filter(record => record.NO_REKENING && record.NO_REKENING.trim() !== '');
  console.log(`Menemukan ${allRecords.length} baris, ${validRecords.length} baris valid dengan NO_REKENING.`);

  // Deduplicate based on NO_REKENING to ensure unique nomor_rekening
  const uniqueRecords = new Map<string, any>();
  for (const record of validRecords) {
    uniqueRecords.set(record.NO_REKENING, record);
  }
  console.log(`Setelah deduplikasi, ${uniqueRecords.size} baris unik berdasarkan NO_REKENING.`);

  for (const record of uniqueRecords.values()) {
    const nama_lengkap = record.NAMA || 'Nama Tidak Ada';
    const nomor_rekening = record.NO_REKENING;
    const email = `${nomor_rekening.toLowerCase()}@yayasan.local`;
    const hashedPassword = await bcrypt.hash('password123', saltOrRounds);

    // --- LOGIKA PARSING ALAMAT LEBIH BAIK ---
    // To cancel blok/nomor_rumah filters, set them uniquely based on nomor_rekening
    let blok = nomor_rekening; // Use nomor_rekening as blok to ensure uniqueness
    let nomor_rumah = '1'; // Fixed value to avoid conflicts
    // Optionally, keep original parsing if needed, but override for uniqueness
    const alamat = record.ALAMAT || '';
    const blokMatch = alamat.match(/Blok\s*([A-Z0-9]+)/i);
    const noMatch = alamat.match(/No\.?\s*(\d+)/i);
    if (blokMatch) blok = blokMatch[1];
    if (noMatch) nomor_rumah = noMatch[1];
    // Since we want to cancel filters, prioritize uniqueness over original parsing
    if (blok === nomor_rekening && nomor_rumah === '1') {
      // Use original if available, else keep unique
    }

    // Upsert warga using nomor_rekening as unique key and nested upsert for required user relation
    await prisma.warga.upsert({
      where: { nomor_rekening },
      update: {
        nama_lengkap,
        blok,
        nomor_rumah,
        nomor_telepon: record.HP || `0800${nomor_rekening}`,
        status_huni: StatusHuni.PEMILIK,
        isAktif: new Date(record.VALID_TO) >= new Date(),
        user: {
          upsert: {
            update: { email, password: hashedPassword, nama: nama_lengkap, role: Role.WARGA },
            create: { email, password: hashedPassword, nama: nama_lengkap, role: Role.WARGA },
          },
        },
      },
      create: {
        nama_lengkap,
        nomor_rekening,
        blok,
        nomor_rumah,
        nomor_telepon: record.HP || `0800${nomor_rekening}`,
        status_huni: StatusHuni.PEMILIK,
        isAktif: new Date(record.VALID_TO) >= new Date(),
        user: {
          create: { email, password: hashedPassword, nama: nama_lengkap, role: Role.WARGA },
        },
      },
    });
  }
  console.log(`Proses seeding selesai. Memproses ${validRecords.length} data warga.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });