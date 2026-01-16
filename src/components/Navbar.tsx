"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import CTAButton from './CTAButton'
import { Menu, X } from 'lucide-react'
import { Button } from './ui/button'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav
      className={`
        fixed  top-0 z-50 w-full border-b border-slate-100
        transition-all duration-300 ease-in-out
        ${isMenuOpen ? 'bg-white' : 'bg-white/80 backdrop-blur-md'}
      `}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* --- MAIN HEADER (Visible Always) --- */}
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-xl font-bold tracking-tight text-slate-900">PushUp</span>
          </div>

          {/* Desktop Nav (Hidden on Mobile) */}
          <div className="hidden md:flex md:items-center md:gap-8">
            <ul className="flex gap-6 text-sm font-medium text-slate-600">
              <li className="hover:text-black cursor-pointer transition-colors">Features</li>
              {/* <li className="hover:text-black cursor-pointer transition-colors">Demo</li> */}
              {/* <li className="hover:text-black cursor-pointer transition-colors">Pricing</li> */}
              <li className="hover:text-black cursor-pointer transition-colors">FAQ</li>
            </ul>
            <Link href="/login">
              <CTAButton text="Get Started for free" />
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle Menu"
            >
              {/* Icon Animation: Rotates between Menu and X */}
              <div className="relative h-6 w-6">
                 <Menu className={`absolute transition-all duration-300 size-6 ${isMenuOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`} />
                 <X className={`absolute transition-all duration-300 size-6 ${isMenuOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`} />
              </div>
            </Button>
          </div>
        </div>

        {/* --- THE SMOOTH DROPDOWN --- 
            1. We use a GRID layout.
            2. When closed: 'grid-rows-[0fr]' (0 height).
            3. When open: 'grid-rows-[1fr]' (full height).
            4. The 'inner' div must have 'overflow-hidden'.
        */}
        <div
          className={`
            grid overflow-hidden transition-all duration-300 ease-in-out md:hidden
            ${isMenuOpen ? "grid-rows-[1fr] opacity-100 pb-6" : "grid-rows-[0fr] opacity-0"}
          `}
        >
          <div className="min-h-0 overflow-hidden">
            <ul className="flex flex-col gap-4 pt-2 text-center text-lg font-medium text-gray-600">
              <li className="py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">Features</li>
              {/* <li className="py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">Pricing</li> */}
              {/* <li className="py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">Demo</li> */}
              <li className="py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">FAQ</li>
              <li className="pb-3">
                 <Link href="/login" className="block" onClick={() => setIsMenuOpen(false)}
                 >
                    <CTAButton text="Get Started for free" />
                 </Link>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </nav>
  )
}