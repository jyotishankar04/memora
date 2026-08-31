import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/common/theme-provider";
import { Toaster } from "@/components/ui/toast";
import { QueryProvider } from "./providers";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SaveForLatter — Save it now, find it later",
  description: "Your personal memory for the internet. Save links, notes, videos, and screenshots, and find them again with a search that understands what you meant.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
      suppressHydrationWarning
    >
    <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryProvider>
            <Toaster>
              {children}
            </Toaster>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
