import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/navbar";
import { SahayakChat } from "@/components/sahayak-chat";

export const metadata: Metadata = {
  title: "CitizenDesk",
  description: "Check your eligibility and document readiness for government schemes.",
};

import { LanguageProvider } from "@/lib/LanguageContext";
import { Toaster } from "sonner";
import Footer from "@/components/footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased flex flex-col")}>
        <LanguageProvider>
          <Navbar />
          <main className="flex-1 pt-24">
            {children}
          </main>
          <Footer />
          <SahayakChat />
          <Toaster position="top-center" richColors />
        </LanguageProvider>
      </body>
    </html>
  );
}
