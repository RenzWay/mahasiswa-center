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
import {Button} from "@/components/ui/button";
import {useTheme} from "next-themes";
import {useEffect, useState} from "react";
import {Separator} from "@/components/ui/separator";
import {CalendarDays, CheckSquare, LayoutDashboard, Moon, NotebookPen, Sun} from "lucide-react";
import Image from "next/image";

const menuItems = [
    {name: "Dashboard", icon: LayoutDashboard, href: "/"},
    {name: "Task", icon: CheckSquare, href: "/task"},
    {name: "Schedule", icon: CalendarDays, href: "/schedule"},
    {name: "Note", icon: NotebookPen, href: "/note"},
];

export function AppSidebar() {
    const {theme, setTheme} = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);
    if (!mounted) return null; // Cegah mismatch dari SSR

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="font-bold text-xl select-none">
                        <Image className="mr-4" src="/colleger.png" width={30} height={30}
                               alt="icon mahasiswa"/> Mahasiswa Center
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
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Button
                            variant="outline"
                            onClick={toggleTheme}
                            className="w-full flex items-center justify-between"
                        >
                            {theme === "light" ? (
                                <>
                                    <Sun className="mr-2 h-4 w-4"/> Light Mode
                                </>
                            ) : (
                                <>
                                    <Moon className="mr-2 h-4 w-4"/> Dark Mode
                                </>
                            )}
                        </Button>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarFooter>
        </Sidebar>
    );
}
