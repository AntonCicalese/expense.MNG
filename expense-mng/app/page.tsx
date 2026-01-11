"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-header mb-8 leading-tight">
          EXPEN<span className="text-accent">$</span>E.MNG
        </h1>
        <p className="text-xl md:text-2xl text-subheader mb-12 leading-relaxed max-w-lg mx-auto">
          Track your income and expenses with beautiful charts
        </p>
        <Link
          href="/dashboard"
          className="inline-block px-12 py-6 text-xl font-bold bg-transparent border border-accent hover:bg-accent-dark text-header rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
