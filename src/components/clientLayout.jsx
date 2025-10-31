"use client";

import {usePathname} from "next/navigation";
import {AppSidebar} from "@/components/app-sidebar";
import {SidebarTrigger} from "@/components/ui/sidebar";
import PageTransition from "@/app/lib/page-transition";
import Footer from "@/app/lib/footer";

export default function ClientLayout({children}) {
    const loc = usePathname();
    const hideSidebar =
        loc.startsWith("/auth/login") || loc.startsWith("/auth/register");

    return (
        <>
            {!hideSidebar && <AppSidebar/>}

            <main className="flex-1">
                {!hideSidebar && <SidebarTrigger/>}
                <PageTransition>{children}</PageTransition>
                {!hideSidebar && <Footer/>}
            </main>
        </>
    );
}
