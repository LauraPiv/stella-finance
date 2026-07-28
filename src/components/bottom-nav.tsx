"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ICONS = {
  dash: "M 18 18 h 28 v 28 h -28 z M 52 18 h 26 v 16 h -26 z M 52 40 h 26 v 38 h -26 z M 18 52 h 28 v 26 h -28 z",
  tx: "M 16 28 h 64 v 11 h -64 z M 16 50 h 42 v 11 h -42 z M 16 68 h 26 v 9 h -26 z",
  goals:
    "M 48 12 a 36 36 0 1 1 0 72 a 36 36 0 1 1 0 -72 m 0 11 a 25 25 0 1 0 0 50 a 25 25 0 1 0 0 -50 m 0 17 a 8 8 0 1 1 0 16 a 8 8 0 1 1 0 -16",
  star: "M 48 10 L 50.3 42.46 L 63.56 32.44 L 53.54 45.7 L 86 48 L 53.54 50.3 L 63.56 63.56 L 50.3 53.54 L 48 86 L 45.7 53.54 L 32.44 63.56 L 42.46 50.3 L 10 48 L 42.46 45.7 L 32.44 32.44 L 45.7 42.46 Z",
  profile: "M 48 16 a 16 16 0 1 1 0 32 a 16 16 0 1 1 0 -32 M 18 84 a 30 26 0 0 1 60 0 z",
};

const TABS = [
  { href: "/dashboard", label: "Início", icon: ICONS.dash, group: ["/dashboard"] },
  {
    href: "/dashboard/transactions",
    label: "Transações",
    icon: ICONS.tx,
    group: ["/dashboard/transactions"],
  },
  { href: "/dashboard/goals", label: "Metas", icon: ICONS.goals, group: ["/dashboard/goals"] },
  { href: "/dashboard/mentora", label: "Mentora", icon: ICONS.star, group: ["/dashboard/mentora"] },
  {
    href: "/dashboard/settings",
    label: "Perfil",
    icon: ICONS.profile,
    group: ["/dashboard/settings", "/dashboard/accounts", "/dashboard/aprender"],
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="flex shrink-0 border-t border-cream bg-white px-1.5 pt-2 pb-3.5">
      {TABS.map((tab) => {
        const active = tab.group.some(
          (p) => pathname === p || pathname.startsWith(`${p}/`),
        );
        const color = active ? "var(--color-berry)" : "rgba(75,21,40,0.42)";
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex min-h-[52px] flex-1 flex-col items-center gap-1.5 py-2"
          >
            <svg width="22" height="22" viewBox="0 0 96 96" aria-hidden="true">
              <path d={tab.icon} fill={color} fillRule="evenodd" />
            </svg>
            <span
              className="font-heading text-[10.5px] font-semibold tracking-wide"
              style={{ color }}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
