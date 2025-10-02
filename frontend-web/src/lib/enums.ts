// frontend-web/src/lib/enums.ts
// Shared enums for client-side code. Keep in sync with Prisma schema values.
export enum StatusHuni {
  PEMILIK = "PEMILIK",
  PENGONTRAK = "PENGONTRAK",
}

export const StatusHuniValues = Object.values(StatusHuni);
