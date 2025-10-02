import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const quickLinks = [
  {
    title: "Kelola Tagihan",
    description: "Lihat daftar tagihan, status pembayaran, dan generate invoice terbaru.",
    href: "/dashboard/tagihan",
  },
  {
    title: "Pencatatan Meter",
    description: "Catat dan validasi meter air bulanan warga secara real time.",
    href: "/dashboard/pencatatan",
  },
  {
    title: "Data Warga",
    description: "Periksa profil lengkap warga dan status kepemilikan rumah.",
    href: "/dashboard/warga",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Selamat datang di Dashboard YPI</h2>
        <p className="text-muted-foreground">
          Pantau penagihan air, pencatatan meter, dan data warga secara terpusat.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {quickLinks.map((link) => (
          <Card
            key={link.href}
            className="group transition hover:border-primary/50 hover:shadow-lg"
          >
            <CardHeader>
              <CardTitle>{link.title}</CardTitle>
              <CardDescription>{link.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href={link.href}
                className="inline-flex items-center text-sm font-medium text-primary hover:underline"
              >
                Buka halaman
                <span aria-hidden className="ml-2 transition group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}