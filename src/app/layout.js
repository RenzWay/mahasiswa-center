import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";

import {ThemeProvider} from "@/components/ThemeProvider";
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/app-sidebar";
import PageTransition from "@/app/lib/page-transition";
import Footer from "@/app/lib/footer";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "Mahasiswa Center",
    description: "The Web App with new some surprise",
    icons: {
        icon: "/colleger.png",
    },
};

export default function RootLayout({children}) {

    return (
        <html lang="en" suppressHydrationWarning>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >

        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <SidebarProvider>
                <AppSidebar/>
                <main className="flex-1">
                    <SidebarTrigger/>
                    <PageTransition>
                        {children}
                    </PageTransition>
                    <Footer/>
                </main>
            </SidebarProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}
