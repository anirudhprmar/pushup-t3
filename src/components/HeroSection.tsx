"use client"
import React from 'react'
import {motion} from "motion/react"
import Link from 'next/link'
import CTAButton from './CTAButton'
import { DashboardSafari } from './DashboardOnSafari'

export default function HeroSection() {
    
  return (
    <section className="relative w-full bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-26 md:py-26">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            
          

            {/* Main Heading */}
            <h1 className="max-w-4xl text-5xl md:text-6xl lg:text-7xl font-medium mb-6 leading-tight tracking-tight text-slate-900">
              Keep life <span className='font-serif italic'>organized</span>
              <br />
              and work <span className="font-serif italic">moving</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-md">
              Track, monitor, and grow with all your habits and tasks unified in one powerful app.
            </p>

            <div className='flex flex-col items-center justify-center gap-4'>

            {/* CTA Button */}
            <Link href="/login">
              <CTAButton text="Start for free" />
            </Link>

              {/* Social Proof */}
            {/* <div className="flex items-center gap-3 mb-8">
              <AvatarCircles
                numPeople={99}
                avatarUrls={[
                  {
                    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                    profileUrl: "#",
                  },
                  {
                    imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    profileUrl: "#",
                  },
                  {
                    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=987&auto=format&fit=crop",
                    profileUrl: "#",
                  },
                ]}
              />
                <p className="text-xs text-muted-foreground">Join the </p>
            </div> */}

            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative mt-16 md:mt-24 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative overflow-hidden rounded-2xl shadow-2xl"
            >
              <DashboardSafari/>
              {/* <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" /> */}
            </motion.div>
          </div>
        </div>
      </section>
  )
}
