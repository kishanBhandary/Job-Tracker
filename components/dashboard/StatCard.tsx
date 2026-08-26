import React from 'react'

interface StatCardProps {
  title: string
  value: number
  description?: string
  className?: string
}

export function StatCard({ title, value, description, className = '' }: StatCardProps) {
  const isRate = title.toLowerCase().includes('rate')

  // Pick unique gradient and sparkline path depending on card type
  const getCardTheme = () => {
    const t = title.toLowerCase()
    if (t.includes('total') || t.includes('applications')) {
      return {
        glow: 'group-hover:shadow-indigo-500/5',
        sparkline: 'M0 25 C 15 20, 30 5, 45 15, 60 2, 75 10, 100 8',
        stroke: 'stroke-indigo-500',
        fill: 'fill-indigo-500/5'
      }
    }
    if (t.includes('interview')) {
      return {
        glow: 'group-hover:shadow-amber-500/5',
        sparkline: 'M0 25 C 20 20, 40 25, 60 10, 80 5, 90 2, 100 4',
        stroke: 'stroke-amber-500',
        fill: 'fill-amber-500/5'
      }
    }
    if (t.includes('offer')) {
      return {
        glow: 'group-hover:shadow-emerald-500/5',
        sparkline: 'M0 20 C 15 22, 30 18, 50 8, 70 12, 85 2, 100 1',
        stroke: 'stroke-emerald-500',
        fill: 'fill-emerald-500/5'
      }
    }
    return {
      glow: 'group-hover:shadow-rose-500/5',
      sparkline: 'M0 5 C 20 8, 40 18, 60 10, 80 22, 90 28, 100 29',
      stroke: 'stroke-rose-500',
      fill: 'fill-rose-500/5'
    }
  }

  const theme = getCardTheme()

  return (
    <div className={`group bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-xl hover:border-neutral-300 transition-all duration-300 flex flex-col justify-between min-h-[125px] relative overflow-hidden ${theme.glow} ${className}`}>
      
      {/* Decorative gradient light corner */}
      <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-gradient-to-br from-neutral-50 to-neutral-100/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="flex items-start justify-between">
        <div className="flex flex-col text-left">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">{title}</span>
          <div className="flex items-baseline gap-0.5 mt-2">
            <span className="text-3xl font-extrabold text-neutral-950 tracking-tight leading-none">{value}</span>
            {isRate && <span className="text-base font-bold text-neutral-450">%</span>}
          </div>
        </div>

        {/* Sparkline visualization */}
        <div className="w-16 h-8 opacity-70 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
          <svg className="w-full h-full" viewBox="0 0 100 30" fill="none">
            <path 
              d={`${theme.sparkline} L 100 30 L 0 30 Z`} 
              className={theme.fill}
            />
            <path 
              d={theme.sparkline} 
              className={theme.stroke} 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </svg>
        </div>
      </div>
      
      {description && (
        <span className="text-xs text-neutral-450 font-medium mt-2 text-left">{description}</span>
      )}
    </div>
  )
}
