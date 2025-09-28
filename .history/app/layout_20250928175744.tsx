import "./globals.css";
import type {Metadata} from "next";
import {Inter} from "next/font/google";
import {AuthProvider} from "@/context/AuthContext";
import {Toaster} from "react-hot-toast";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "File Server Admin",
  description: "Admin dashboard for file server management",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
