import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function notFound() {
  return (
    <div >
        
        <div className='text-center text-4xl font-bold mt-50 pt-20'>
        sorry to see you here
        </div>

      <div className=' flex items-center justify-center max-w-full'>
      <Link  href={'/'} className='flex gap-2'>
      <ArrowLeft/> Back to Home
      </Link>
      </div>
    </div>
  )
}
