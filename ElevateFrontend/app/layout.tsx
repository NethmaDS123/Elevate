"use client";

import { SessionProvider } from "next-auth/react";
// import Footer from "@/components/Footer"; // Commented out as it's not used
import "./globals.css";
import "@/lib/axiosInterceptors";
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className=" relative">
        <div className="relative z-10 flex flex-col min-h-screen">
          <SessionProvider>
            {" "}
            {/* Session provider for authentication */}
            <main className="flex-grow">
              {" "}
              {/* Main content area */}
              {children} {/* Children components */}
              <Analytics /> {/* Vercel analytics */}
            </main>
          </SessionProvider>
        </div>
      </body>
    </html>
  );
}
