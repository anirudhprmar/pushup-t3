"use client"

import Features from "~/components/Features"
import HeroSection from "~/components/HeroSection"
import Navbar from "~/components/Navbar"
import Footer from "~/components/Footer"
import LandingCTA from "~/components/LandingCTA"

export default function Landing() {
  return (
    <div className="relative min-h-full overflow-hidden text-black w-full bg-white">

      {/* Navigation */}
      <Navbar/>

      {/* Hero Section */}
     <HeroSection/>

      {/* Features Section */}
     <Features/>

      {/* faq */}

      {/* Final CTA Section */}
      <LandingCTA/>

      {/* footer */}
      <Footer />
    </div>
  )
}