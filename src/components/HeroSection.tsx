"use client"
import React from 'react'
import { Button } from './ui/button'
import {motion} from "motion/react"
import Link from 'next/link'
import CTAButton from './CTAButton'
import { Flame } from 'lucide-react'
import { useCounter } from '~/hooks/UseCounter'
import Image from 'next/image'
import { AvatarCircles } from './ui/avatar-circles'

export default function HeroSection() {
    const count = useCounter(365, 2000)
    
  return (
    <section className="relative w-full pt-5 pb-32 md:pb-48 isolate">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[length:6rem_4rem] mask-image:radial-gradient(ellipse_at_center,black,transparent)">
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-start justify-center py-5 gap-3">

          <div className="max-w-5xl mx-auto text-center flex flex-col items-start  ">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-300/10 border border-black/10 mb-8 backdrop-blur-sm">
            <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
          </motion.div>
              <span className="text-sm font-semibold">{count} Days of Pure Transformation</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-8 leading-[1.05] tracking-tight ">
              Don&apos;t just {" "} 
                <span className="relative z-10  ">Dream,</span>
              <br />
              Make it a{" "}
              <span className="relative inline-block px-2">
                <span className="italic font-semibold text-white ">Reality.</span>
               <span className="absolute inset-0 bg-black/80 -skew-x-12 -z-10 " />
              </span>
              
            </h1>

            {/* Subheading */}
            <p className="text-md text-black/70 mb-8 leading-relaxed font-medium text-left ">
              Don&apos;t just build habits. Build a lifestyle. Transform into the best version of yourself through 365 days of relentless consistency.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 justify-center items-start">
              <Link href="/login">
                <CTAButton text="Start Your Journey"/>
              </Link>
              <div className="flex items-center gap-2">
                <AvatarCircles
                  numPeople={2}
                  avatarUrls={[
                    {
                      imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                      profileUrl: "https://github.com/shadcn",
                    },
                    {
                      imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                      profileUrl: "https://github.com/shadcn",
                    },
                  ]}
                />
                <p className='text-sm text-black/60 font-medium'>Join the people changing their lives</p>
              </div>
            </div>

            {/* Stats */}
            <div className="hidden grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-black mb-2">365</div>
                <div className="text-sm text-black/60 font-medium">Days Challenge</div>
              </div>
              <div className="text-center border-x border-black/10">
                <div className="text-4xl font-black mb-2">100%</div>
                <div className="text-sm text-black/60 font-medium">Commitment</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black mb-2">∞</div>
                <div className="text-sm text-black/60 font-medium">Potential</div>
              </div>
            </div>
          </div>
          
         <div className="relative h-full w-full overflow-hidden rounded-2xl">
            {/* 1. The Image */}
            <Image
              src="/dashboard.png" 
              alt="Mock"
              className="h-full w-full object-cover"
              width={400}
              height={400}
            />

            {/* 2. The Mask/Overlay (The "Mask Effect") */}
            <div className="absolute inset-0 bg-black/20 hover:bg-black/0 transition-colors" />
          </div>
        </div>
      </section>
  )
}
