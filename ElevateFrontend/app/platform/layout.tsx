"use client";

import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { SidebarProvider } from "@/components/SidebarContext";
import { useSession } from "next-auth/react"; // Or your authentication hook

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, status } = useSession(); // Replace with your auth system

  // Show loading state while checking authentication
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // Redirect to sign-in if not authenticated
  if (!session) {
    router.push("/signin");
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex">
        <Sidebar />
        <main className="flex-1">{children}</main>
      </div>
    </SidebarProvider>
  );
}
