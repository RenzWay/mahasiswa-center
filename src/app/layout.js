import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/ThemeProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Analytics } from "@vercel/analytics/next";
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
  metadataBase: new URL("https://mahasiswa-center.vercel.app"),
  title: "Mahasiswa Center | Kelola Tugas, Jadwal, dan Catatan Kuliah",
  description:
    "Atur tugas kuliah, jadwal, dan catatan belajar dalam satu workspace sederhana untuk mahasiswa.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Mahasiswa Center | Workspace Akademik Mahasiswa",
    description:
      "Kelola tugas kuliah, jadwal, dan catatan belajar dalam satu tempat.",
    url: "https://mahasiswa-center.vercel.app/",
    siteName: "Mahasiswa Center",
    type: "website",
    locale: "id_ID",
  },
  icons: {
    icon: [
      { rel: "icon", url: "/colleger.png", type: "image/png" },
      { rel: "shortcut icon", url: "/colleger.png", type: "image/png" },
      { rel: "apple-touch-icon", url: "/colleger.png", type: "image/png" },
    ],
  },
  verification: {
    google: "2H2Xyrls9JrjPGKFIJz2wvgbSaV7jggvBxNLQKmrDVw",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/app.webmanifest" />
        <link rel="icon" href="/colleger.png" type="image/png" />
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
            <ClientLayout>
              <RegisterSW />
              {children}
            </ClientLayout>
          </SidebarProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
