"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  HardHat,
  Layers3,
  FileText,
  BriefcaseBusiness,
  MessageSquareQuote,
  ChartNoAxesCombined,
} from "lucide-react";

const navigationItems = [
  {
    label: "Tableau de bord",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Chantiers",
    href: "/admin/projets",
    icon: HardHat,
  },
  {
    label: "Solutions",
    href: "/admin/solutions",
    icon: Layers3,
  },
  {
    label: "Statistiques",
    href: "/admin/statistiques",
    icon: ChartNoAxesCombined,
  },
  {
    label: "Demandes de devis",
    href: "/admin/devis",
    icon: FileText,
  },
  // {
  //   label: "Services",
  //   href: "/admin/services",
  //   icon: BriefcaseBusiness,
  // },
  {
    label: "Témoignages",
    href: "/admin/temoignages",
    icon: MessageSquareQuote,
  },
];

export default function AdminNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigation principale de l'administration"
      className="flex gap-2 overflow-x-auto pb-1"
    >
      {navigationItems.map((item) => {
        const Icon = item.icon;

        const isActive =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
              isActive
                ? "bg-[#D59344] text-[#10161F] shadow-sm"
                : "text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon size={17} strokeWidth={1.8} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}