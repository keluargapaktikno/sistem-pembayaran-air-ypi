// frontend-web/src/app/layout.tsx (KODE LENGKAP)
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sistem Manajemen Air YPI",
  description: "Sistem Manajemen Pembayaran Air Yayasan Pongangan Indah",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}