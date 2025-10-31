"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import {useTheme} from "next-themes";
import {useEffect, useState} from "react";
import {Separator} from "@/components/ui/separator";
import {CalendarDays, CheckSquare, LayoutDashboard, NotebookPen} from "lucide-react";
import Image from "next/image";
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "@/firebase/firebase";
import ModelFirestore from "@/model/model";
import {DropdownFooterSidebar} from "@/app/lib/dropdown";

const model = new ModelFirestore();

const menuItems = [
    {name: "Dashboard", icon: LayoutDashboard, href: "/"},
    {name: "Task", icon: CheckSquare, href: "/task"},
    {name: "Schedule", icon: CalendarDays, href: "/schedule"},
    {name: "Note", icon: NotebookPen, href: "/note"},
];

export function AppSidebar() {
    const {theme, setTheme} = useTheme();
    const [mounted, setMounted] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        setMounted(true);

        const unsubscribe = onAuthStateChanged(auth, (u) => {
            setUser(u);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => setMounted(true), []);
    if (!mounted) return null; // Cegah mismatch dari SSR

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="font-bold text-xl select-none flex items-center gap-2">
                        <Image src="/colleger.png" width={30} height={30} alt="icon mahasiswa"/>
                        Mahasiswa Center
                    </SidebarGroupLabel>
                    <Separator className="my-4"/>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item, i) => (
                                <SidebarMenuItem key={i}>
                                    <SidebarMenuButton asChild>
                                        <Link
                                            href={item.href}
                                            className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-accent"
                                        >
                                            <item.icon className="h-4 w-4"/>
                                            <span>{item.name}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <Separator className="my-4"/>
                <DropdownFooterSidebar theme={theme} setTheme={setTheme} toggleTheme={toggleTheme} user={user}/>
            </SidebarFooter>
        </Sidebar>
    );
}