import CTAButton from './CTAButton'

export default function LandingCTA() {
  return (
    <section className="relative py-10 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* CTA Card */}
        <div className="relative rounded-3xl overflow-hidden py-12 md:py-16 px-8 md:px-16">

          {/* Content */}
          <div className="relative text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 leading-tight text-foreground font-serif">
              Start <span className="text-primary">Building Discipline</span> with Habits
            </h2>
            
            <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Launch your 365-day commitment in minutes and let consistency transform your life around the clock
            </p>

            <CTAButton text='Get Started'/>
          </div>
        </div>
      </div>
    </section>
  )
}