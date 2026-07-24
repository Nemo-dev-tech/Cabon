import { Link, useLocation } from "react-router-dom";
import { Home, Store, BarChart3, MessageCircle, User } from "lucide-react";

const TABS = [
  { to: "/", label: "หน้าหลัก", icon: Home },
  { to: "/market", label: "ตลาด", icon: Store },
  { to: "/impact", label: "ผลกระทบ", icon: BarChart3 },
  { to: "/chatbot", label: "หมอข้าว", icon: MessageCircle },
  { to: "/profile", label: "โปรไฟล์", icon: User },
];

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-emerald-100 pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-md mx-auto grid grid-cols-5">
        {TABS.map((t) => {
          const active = pathname === t.to;
          const Icon = t.icon;
          return (
            <Link
              key={t.to}
              to={t.to}
              className={`flex flex-col items-center gap-1 py-2.5 transition-colors ${
                active ? "text-emerald-600" : "text-stone-400"
              }`}
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.5 : 2}
                className={active ? "scale-110 transition-transform" : ""}
              />
              <span className="text-[11px] font-medium">{t.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
