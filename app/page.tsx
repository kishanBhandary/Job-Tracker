import React from 'react'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function LandingPage() {
  const user = await getCurrentUser()
  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans relative overflow-hidden"
      style={{
        backgroundImage: 'radial-gradient(#e5e7eb 1.2px, transparent 1.2px)',
        backgroundSize: '24px 24px'
      }}
    >
      {/* Header */}
      <header className="border-b border-neutral-200/60 bg-white/80 backdrop-blur-md px-6 py-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded border border-neutral-200 flex items-center justify-center p-0.5 bg-neutral-50 shadow-sm">
              <img 
                src="/job.png" 
                alt="CareerTrack Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-base font-bold text-neutral-900 tracking-tight">CareerTrack</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-neutral-500 hover:text-neutral-950 transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="text-sm font-semibold bg-neutral-900 text-white px-3.5 py-2 rounded-lg hover:bg-black transition-all shadow-sm">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Main Hero */}
      <main className="flex-grow max-w-5xl mx-auto w-full px-6 py-16 md:py-24 flex flex-col items-center text-center relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900/5 border border-neutral-900/10 text-xs font-semibold text-neutral-800 mb-6 backdrop-blur-sm">
          <span>✨</span>
          <span>Now with Local & Supabase Sync Fallbacks</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-950 leading-tight max-w-2xl">
          Track your job search, <br className="hidden sm:inline" />without the chaos.
        </h1>
        <p className="mt-6 text-sm md:text-base text-neutral-500 max-w-lg leading-relaxed">
          Keep every application, interview, contact, and job offer beautifully organized in one highly focused pipeline.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <Link href="/register" className="bg-neutral-900 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-black transition-all border border-neutral-900 shadow-md">
            Get Started Free
          </Link>
          <Link href="/login" className="bg-white text-neutral-800 px-6 py-3 rounded-lg text-sm font-semibold hover:bg-neutral-50 transition-all border border-neutral-200/80 shadow-sm">
            Sign In
          </Link>
        </div>

        {/* Dashboard Preview Mockup */}
        <div className="mt-16 md:mt-20 border border-neutral-200 rounded-xl shadow-xl overflow-hidden bg-white max-w-3xl w-full">
          {/* Mockup Header */}
          <div className="bg-neutral-50 border-b border-neutral-200 px-4 py-3 flex items-center justify-between text-left">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
            </div>
            <span className="text-[10px] text-neutral-400 font-semibold tracking-wide">careertrack.app/dashboard</span>
            <div className="w-8" />
          </div>

          {/* Mockup App Interface */}
          <div className="flex text-left">
            {/* Sidebar Mockup */}
            <div className="hidden sm:flex flex-col gap-3 w-44 border-r border-neutral-150 p-4 bg-white">
              <div className="flex items-center gap-2 mb-4">
                <img src="/job.png" alt="Logo" className="w-4 h-4 object-contain" />
                <div className="h-3 w-16 bg-neutral-200 rounded" />
              </div>
              <div className="h-5 w-24 bg-neutral-50 rounded border border-neutral-200" />
              <div className="h-5 w-20 bg-neutral-50/50 rounded" />
              <div className="h-5 w-22 bg-neutral-50/50 rounded" />
              <div className="h-5 w-16 bg-neutral-50/50 rounded" />
            </div>

            {/* Content Mockup */}
            <div className="flex-grow p-5 sm:p-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <div>
                  <div className="h-4 w-28 bg-neutral-200 rounded" />
                  <div className="h-3 w-40 bg-neutral-100 rounded mt-1.5" />
                </div>
                <div className="h-7 w-20 bg-neutral-100 rounded-lg" />
              </div>

              {/* Stats Mockup */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
                {[
                  { title: 'Applications', value: 12 },
                  { title: 'Interviews', value: 4 },
                  { title: 'Offers', value: 2 },
                  { title: 'Rejected', value: 5 },
                ].map((s, i) => (
                  <div key={i} className="p-3 border border-neutral-200 rounded-lg shadow-sm">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">{s.title}</span>
                    <span className="text-lg font-bold mt-0.5 block text-neutral-950">{s.value}</span>
                  </div>
                ))}
              </div>

              {/* Recent Applications Mockup */}
              <div className="border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
                <div className="px-3 py-2 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
                  <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Recent Applications</span>
                  <span className="text-[9px] font-medium text-neutral-400">View all &rarr;</span>
                </div>
                <div className="divide-y divide-neutral-150 text-xs bg-white">
                  <div className="px-3 py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-neutral-800">Google</span>
                      <span className="text-neutral-400 ml-1">· Software Engineer</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-amber-50 text-amber-700 border border-amber-200">Interview</span>
                      <span className="text-neutral-400">Aug 25</span>
                    </div>
                  </div>
                  <div className="px-3 py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-neutral-800">Infosys</span>
                      <span className="text-neutral-400 ml-1">· Developer</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-neutral-50 text-neutral-600 border border-neutral-200">Applied</span>
                      <span className="text-neutral-400">Aug 23</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200/50 bg-white/50 backdrop-blur-sm py-8 text-center text-xs text-neutral-400 flex-shrink-0 relative z-10">
        &copy; {new Date().getFullYear()} CareerTrack. All rights reserved.
      </footer>
    </div>
  )
}
