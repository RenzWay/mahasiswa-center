import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";

import {ThemeProvider} from "@/components/ThemeProvider";
import {SidebarProvider} from "@/components/ui/sidebar";
import ClientLayout from "@/components/clientLayout";
import RegisterSW from "@/register";

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
        icon: [
            {rel: "icon", url: "/colleger.png", type: "image/png"},
            {rel: "shortcut icon", url: "/colleger.png", type: "image/png"},
            {rel: "apple-touch-icon", url: "/colleger.png", type: "image/png"},
        ],
    },
    verification: {
        google: "2H2Xyrls9JrjPGKFIJz2wvgbSaV7jggvBxNLQKmrDVw",
    },
};

export default function RootLayout({children}) {
    return (
        <html lang="en" suppressHydrationWarning>
        <head>
            <link rel="manifest" href="/app.webmanifest"/>
            <link href="/colleger.png" rel="icon" type="image/png"/>
        </head>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased bg-indigo-50 dark:bg-slate-800`}
        >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <SidebarProvider>
                {/* Client-side layout logic */}
                <ClientLayout>
                    <RegisterSW/>
                    {children}
                </ClientLayout>
            </SidebarProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}