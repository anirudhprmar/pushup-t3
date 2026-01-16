import { 
  Target, 
  ChartLine, 
  CalendarCheck, 
  Trophy, 
  Flame, 
} from "lucide-react"
import React from 'react'
import { Card } from "~/components/ui/card"

export default function Features() {
  return (
    <section className="relative py-24 bg-linear-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-20">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Simple. Powerful. Transformative.
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 font-serif text-slate-900">
            Build Habits That <span className="text-primary">Last</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-sm mx-auto">
            Transform your life one day at a time. Track consistency, visualize progress, and achieve your goals with our minimalist approach.
          </p>
        </div>

       

       

        {/* Features Grid */}
        <div className="space-y-20 max-w-4xl mx-auto">
          {/* Feature 1 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-3xl font-bold font-serif text-slate-900">365-Day Commitment</h4>
              </div>
              <p className="text-md text-slate-600 leading-relaxed">
                All or nothing. Miss even one habit, and the counter resets. This isn&apos;t about perfection—it&apos;s about understanding that every single day builds who you are. True transformation requires unwavering consistency.
              </p>
            </div>
            <Card className="order-1 md:order-2 p-8 bg-linear-to-br from-primary/5 to-primary/10 border-primary/20 min-h-[280px] flex items-center justify-center">
              <div className="text-center">
                <div className="text-7xl font-black text-primary mb-4">365</div>
                <p className="text-xl font-semibold text-accent">Days to Transform</p>
              </div>
            </Card>
          </div>

          {/* Feature 2 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Card className="p-8 bg-linear-to-br from-primary/5 to-primary/10 border-primary/20 min-h-[280px] flex items-center justify-center">
              <div className="w-full">
                <ChartLine className="w-16 h-16 text-primary mx-auto mb-4" />
                <div className="flex items-end justify-center gap-2">
                  <div className="w-12 h-20 bg-primary/30 rounded-t"></div>
                  <div className="w-12 h-32 bg-primary/50 rounded-t"></div>
                  <div className="w-12 h-48 bg-primary/70 rounded-t"></div>
                  <div className="w-12 h-56 bg-primary rounded-t"></div>
                </div>
              </div>
            </Card>
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <ChartLine className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-3xl font-bold font-serif text-slate-900">Growth Visualization</h4>
              </div>
              <p className="text-md text-slate-600 leading-relaxed">
                Watch your life take an upward spiral with real-time growth charts. See how daily consistency compounds into exponential transformation. Data-driven insights show your progress clearly.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <CalendarCheck className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-3xl font-bold font-serif text-slate-900">Full-Year Calendar</h4>
              </div>
              <p className="text-md text-slate-600 leading-relaxed">
                Track your complete 365-day journey with a visual calendar showing every completed day. Visualize your commitment and watch your transformation unfold in real-time. Never lose sight of your progress.
              </p>
            </div>
            <Card className="order-1 md:order-2 p-8 bg-linear-to-br from-primary/5 to-primary/10 border-primary/20 min-h-[280px] flex items-center justify-center">
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 28 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-6 h-6 rounded ${
                      i < 20 ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </Card>
          </div>

          {/* Feature 4 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Card className="p-8 bg-linear-to-br from-primary/5 to-primary/10 border-primary/20 min-h-[280px] flex items-center justify-center">
              <div className="text-center space-y-6">
                <Flame className="w-20 h-20 text-primary mx-auto" />
                <div className="text-5xl font-black text-primary">20</div>
                <p className="text-xl font-semibold text-accent">Day Streak</p>
              </div>
            </Card>
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Trophy className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-3xl font-bold font-serif text-slate-900">Streak Accountability</h4>
              </div>
              <p className="text-md text-slate-600 leading-relaxed">
                Stay motivated with streak tracking and milestone celebrations. Document your progress, analyze patterns, and make self-improvement engaging. Every day adds to your legacy of consistency.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}