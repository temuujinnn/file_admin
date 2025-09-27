"use client";

import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {useAuth} from "@/context/AuthContext";

export default function HomePage() {
  const {isAuthenticated, loading} = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return null;
}
