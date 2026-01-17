import { Suspense } from 'react'
import { DemoPlayer } from './DemoPlayer'

const VIDEO_URL = "https://163jz9wo57.ufs.sh/f/LDDo8gC5wt4WylurXtf052OATN0ZbPCt3dHJxDLSQe9wFaEv"

export default function Demo() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 font-serif text-gray-900">
            See It In Action
          </h2>
          <p className="text-lg text-gray-600">
            Watch how Pushup helps you stay organized and productive
          </p>
        </div>

        {/* Video Container - Matches Safari aspect ratio */}
        <div className="mx-auto w-full max-w-5xl">
          <Suspense 
            fallback={
              <div 
                className="flex items-center justify-center rounded-2xl bg-gray-100 shadow-2xl animate-pulse"
                style={{ aspectRatio: '1203/753' }}
              >
                <div className="size-16 rounded-full bg-gray-200" />
              </div>
            }
          >
            <DemoPlayer 
              src={VIDEO_URL} 
              title="Pushup Demo" 
            />
          </Suspense>
        </div>
      </div>
    </section>
  )
}
