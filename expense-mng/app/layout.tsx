'use client';

import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  
  // Helper function to check if current path starts with a base path
  const isActivePath = (path: string) => pathname === path || pathname.startsWith(`${path}/`);
  
  return (
    <html lang="en">
      <head>
        <title>EXPEN$E.MNG</title>
        <link
          href="https://api.fontshare.com/v2/css?f[]=pilcrow-rounded@400&f[]=roundo@500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased overflow-hidden">
        <div className="bg-background-light h-20 w-full flex items-center px-10">
          {/* Left: Bigger brand text */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl lg:text-3xl tracking-wide font-roundo text-header">
              EXPEN<span className="text-accent">$</span>E.MNG
            </Link>
          </div>

          {/* Center: Home / Dashboard - Active page bigger */}
          <div className="flex-1 flex items-center justify-center gap-6 relative">
            <Link 
              href="/" 
              className={`transition-all duration-100 hover:text-accent ${
                isActivePath('/') 
                  ? 'text-2xl text-header scale-110' 
                  : 'text-lg text-subheader hover:scale-105'
              }`}
            >
              Home
            </Link>
            <span className={`text-lg transition-colors ${
              isActivePath('/dashboard') 
                ? 'text-body opacity-60' 
                : 'text-body'
            }`}>
              /
            </span>
            <Link 
              href="/dashboard" 
              className={`transition-all duration-100 hover:text-accent ${
                isActivePath('/dashboard') 
                  ? 'text-2xl text-header scale-110' 
                  : 'text-lg text-subheader hover:scale-105'
              }`}
            >
              Dashboard
            </Link>
          </div>
          
          <div className="flex items-center justify-end gap-4 ml-auto">
            <ThemeToggle />
          </div>
        </div>

        {children}
      </body>
    </html>
  );
}
