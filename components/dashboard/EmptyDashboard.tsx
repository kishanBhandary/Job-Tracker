import React from 'react'
import { Plus, Inbox } from 'lucide-react'

interface EmptyDashboardProps {
  onAddFirst: () => void
}

export function EmptyDashboard({ onAddFirst }: EmptyDashboardProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-white border border-neutral-200/80 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] min-h-[240px] max-w-sm mx-auto my-6">
      <div className="w-10 h-10 rounded-lg bg-neutral-50 flex items-center justify-center border border-neutral-200/60 shadow-sm mb-4">
        <Inbox className="w-4.5 h-4.5 text-neutral-450" />
      </div>
      <h3 className="text-xs font-bold text-neutral-950 uppercase tracking-wider">Your job search starts here</h3>
      <p className="mt-2 text-xs text-neutral-450 max-w-[260px] leading-relaxed">
        Add your first application to begin tracking your career opportunities.
      </p>
      <button 
        onClick={onAddFirst}
        className="mt-5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg h-9 px-4 text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
      >
        <Plus size={14} />
        <span>Add Application</span>
      </button>
    </div>
  )
}
