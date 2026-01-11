"use client"

import { Clock } from "@/components/Clock";
import "../globals.css";
import SideBarButton from "@/components/SideBarButton";
import { Calculator } from "@/components/calculator/Calculator";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen bg-background-dark overflow-hidden">
      {/* Sidebar con navigazione e utility */}
      <div className="flex flex-col gap-4 w-1/5 h-full p-8 mt-2">
        <SideBarButton href="/dashboard" text="Dashboard" imagePath="/home.svg" />
        <SideBarButton href="/dashboard/dataEntries" text="Data Entries" imagePath="/table.svg" />
        <SideBarButton href="/dashboard/manageData" text="Manage Data" imagePath="/data.svg" />
        <Clock/>
        <Calculator />
      </div>

      {/* Separatore verticale tra sidebar e contenuto */}
      <div className="flex items-center py-8 px-2 mb-8">
        <div className="w-px h-5/6 bg-header" />
      </div>

      {/* Area principale dashboard con scroll */}
      <div className="grid grid-cols-3 w-full h-full overflow-auto">
        {children}
      </div>
    </div>
  );
}
