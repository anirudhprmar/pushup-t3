"use client"

import Features from "~/components/Features"
import HeroSection from "~/components/HeroSection"
import Navbar from "~/components/Navbar"
import Footer from "~/components/Footer"
import LandingCTA from "~/components/LandingCTA"
import FAQ from "~/components/FAQ"
import Demo from "~/components/Demo"

export default function Landing() {
  return (
    <div className="relative min-h-full overflow-hidden text-black w-full bg-white">

      <header aria-labelledby="site-nav" className="w-full">
        <nav id="site-nav">
          <Navbar />
        </nav>
      </header>

      <main id="main" role="main" aria-labelledby="main-heading" className="w-full">
        <h1 id="main-heading" className="sr-only">PushUp — productivity and habits</h1>

        <section aria-labelledby="hero-heading" className="w-full">
          <h2 id="hero-heading" className="sr-only">Hero</h2>
          <HeroSection />
        </section>


        <section aria-labelledby="features-heading" className="w-full">
          <h2 id="features-heading" className="sr-only">Features</h2>
          <Features />
        </section>

        <section>
          <Demo/>
        </section>
        
        <section>
          <FAQ/>
        </section>

        <section aria-labelledby="cta-heading" className="w-full">
          <h2 id="cta-heading" className="sr-only">Call to action</h2>
          <LandingCTA />
        </section>
      </main>

      <footer role="contentinfo" className="w-full">
        <Footer />
      </footer>
    </div>
  )
}