import Footer from "@/components/Footer";
import "./globals.css";
import { DotBackgroundDemo } from "@/components/Dotbackground";

export const metadata = {
  title: "Elevate",
  description: "AI-driven career development platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="text-white relative">
        {/* Dot Background */}

        {/* Main Content */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <main className="flex-grow">{children}</main>

          <Footer />
        </div>
      </body>
    </html>
  );
}
