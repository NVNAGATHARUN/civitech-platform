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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-background font-sans antialiased")}>
        <LanguageProvider>
          <Navbar />
          <main className="min-h-screen pt-24 pb-12"> {/* Modified className */}
            {children}
          </main>
          <SahayakChat /> {/* Added SahayakChat component */}
        </LanguageProvider>
      </body>
    </html>
  );
}
