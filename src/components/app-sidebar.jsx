"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import {
  CalendarDays,
  CheckSquare,
  LayoutDashboard,
  NotebookPen,
} from "lucide-react";
import Image from "next/image";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import ModelFirestore from "@/model/model";
import { DropdownFooterSidebar } from "@/app/lib/dropdown";

const model = new ModelFirestore();

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/pages/dashboard" },
  { name: "Task", icon: CheckSquare, href: "/task" },
  { name: "Schedule", icon: CalendarDays, href: "/schedule" },
  { name: "Note", icon: NotebookPen, href: "/note" },
];

export function AppSidebar() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setMounted(true);

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => unsubscribe();
  }, []);

  if (!mounted) return null; // Cegah mismatch dari SSR

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Sidebar className="border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <SidebarContent className="px-3 py-4">
        <SidebarGroup className="px-0">
          <Link
            href="/pages/dashboard"
            className="mb-4 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-white shadow-sm dark:bg-slate-950">
              <Image
                src="/colleger.png"
                width={26}
                height={26}
                alt="Mahasiswa Center icon"
              />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold text-slate-950 dark:text-slate-50">
                Mahasiswa Center
              </span>
              <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                Academic workspace
              </span>
            </span>
          </Link>
          <Separator className="mb-4 bg-slate-200 dark:bg-slate-800" />
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {menuItems.map((item, i) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className="h-11 rounded-md px-3 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 data-[active=true]:bg-slate-950 data-[active=true]:text-white dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-50 dark:data-[active=true]:bg-white dark:data-[active=true]:text-slate-950">
                    <Link href={item.href} className="flex items-center gap-3">
                      <span className="flex size-7 items-center justify-center rounded-md bg-slate-100 text-slate-600 group-data-[active=true]/menu-button:bg-white/15 group-data-[active=true]/menu-button:text-current dark:bg-slate-900 dark:text-slate-400 dark:group-data-[active=true]/menu-button:bg-slate-950/10">
                        <item.icon className="size-4" />
                      </span>
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <Separator className="my-3 bg-slate-200 dark:bg-slate-800" />
        <DropdownFooterSidebar
          theme={theme}
          setTheme={setTheme}
          toggleTheme={toggleTheme}
          user={user}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
