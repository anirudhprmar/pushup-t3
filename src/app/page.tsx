"use client"

import { Star, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "~/components/ui/button"

export default function Landing() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full bg-linear-to-br from-gradient-1/20 to-gradient-2/20 blur-[120px] translate-x-1/3" />
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] rounded-full bg-linear-to-br from-gradient-2/15 to-gradient-1/15 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] rounded-full bg-linear-to-br from-gradient-1/10 to-gradient-2/10 blur-[110px]" />
      </div>

      {/* Navigation */}
      <nav className="relative border-b border-border/50 top-0 z-50 backdrop-blur-glass bg-background/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-bold">PushUp</span>
          </div>
          <Link href="/login">
            <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-32 md:pt-18 md:pb-48">
        <div className="max-w-4xl">
          {/* Rating Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 mb-8 backdrop-blur-sm">
            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
            <span className="text-sm font-semibold">365 Days Challenge</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[1.1] tracking-tight">
            <span className="text-muted-foreground/60">Transform Into</span>{" "}
            <span className="heading-display block mt-2">Your Best Self</span>{" "}
            <span className="text-muted-foreground/60">Not</span>{" "}
            <span className="heading-display">Average</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-xl text-muted-foreground mb-12 max-w-2xl leading-relaxed">
            Build unbreakable habits through a 365-day commitment. Every single day counts. No streaks, no shortcuts—just pure transformation.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <Link href="/login">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 px-8 h-12 text-base">
                Get Started <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative max-w-7xl mx-auto px-6 lg:px-8 pb-24 md:pb-32 ">
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {/* Feature 1 */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">All or Nothing</h3>
            <p className="text-muted-foreground leading-relaxed">
            {"Miss even one habit, and the 365-day counter resets. This isn't about perfection—it's about understanding that every single day builds who you are."}
            </p>
          </div>

          {/* Feature 2 */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">365-Day Journey</h3>
            <p className="text-muted-foreground leading-relaxed">
              Track your full-year path with a complete calendar showing every completed day. Visualize your commitment and watch your transformation unfold day by day.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Growth Visualization</h3>
            <p className="text-muted-foreground leading-relaxed">
              Watch your life take an upward spiral with real-time growth charts. See how daily consistency compounds into exponential personal transformation.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}