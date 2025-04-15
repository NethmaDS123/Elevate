"use client";

import { SessionProvider } from "next-auth/react";
import Footer from "@/components/Footer";
import "./globals.css";
import "@/lib/axiosInterceptors"; // Import the interceptor globally

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
            <main className="flex-grow">{children}</main>
          </SessionProvider>
          <Footer />
        </div>
      </body>
    </html>
  );
}
