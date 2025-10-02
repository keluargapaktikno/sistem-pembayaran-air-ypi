// frontend-web/src/components/Sidebar.tsx (KODE LENGKAP)
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, FileText } from "lucide-react"; // Ikon
import { cn } from "@/lib/utils"; // Utilitas dari shadcn

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard/warga", label: "Manajemen Warga", icon: Users },
    { href: "/dashboard/tagihan", label: "Manajemen Tagihan", icon: FileText },
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r bg-white p-4">
      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center rounded-md px-3 py-2 text-sm font-medium",
              pathname === item.href
                ? "bg-slate-100 text-slate-900"
                : "text-slate-600 hover:bg-slate-50"
            )}
          >
            <item.icon className="mr-2 h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}