"use client";

import {useAuth} from "@/context/AuthContext";
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({children}: DashboardLayoutProps) {
  const {isAuthenticated, loading} = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto lg:ml-0">
        <div className="p-6 lg:p-8 pt-20 lg:pt-8">{children}</div>
      </main>
    </div>
  );
}
