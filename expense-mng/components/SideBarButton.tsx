"use client"

import Link from "next/link"
import Image from "next/image"

interface SideBarButtonProps {
    href: string
    text: string
    imagePath: string
}

export default function SideBarButton({ href, text, imagePath }: SideBarButtonProps) {
    return (
        <Link 
            href={href}
            className="group relative w-full flex items-center gap-3 px-4 py-3 text-header transition-all duration-300 ease-out mb-4"
        >
            {/* Background gradient che si attiva su hover, adattivo al tema */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent to-background-light rounded-xl -m-2 transition-all duration-300 group-hover:to-accent/50" />
            
            {/* Container icona con effetti hover: scale, shadow e border accentuato */}
            <div className="relative w-10 h-10 p-2 backdrop-blur-sm group-hover:bg-accent/20 rounded-xl transition-all duration-300 group-hover:scale-105 flex items-center justify-center shadow-sm group-hover:shadow-md border border-background-light/50 group-hover:border-accent/30">
                <Image 
                    src={imagePath} 
                    alt={text}
                    width={24} 
                    height={24}
                    className="w-6 h-6 transition-all duration-100 sidebar-icon"
                />
            </div>
            
            {/* Testo del bottone con colore accentuato su hover */}
            <span className="text-lg font-medium transition-colors duration-300 tracking-wide leading-tight roundo group-hover:text-accent">
                {text}
            </span>
            
            {/* Freccia animata che appare su hover con translateX */}
            <div className="ml-auto w-5 h-5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0">
                <svg 
                    className="w-5 h-5 transition-colors duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </Link>
    )
}
