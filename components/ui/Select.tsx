import React from 'react'

interface Option {
  value: string
  label: string
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: Option[]
  error?: string
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1">
        {label && (
          <label className="text-xs font-semibold text-neutral-500">
            {label}
          </label>
        )}
        <div className="relative w-full">
          <select
            ref={ref}
            className={`w-full px-3 py-2 text-sm bg-white border border-neutral-200/80 rounded-lg text-neutral-900 focus:border-neutral-900 focus:outline-none focus:ring-0 disabled:opacity-50 disabled:bg-neutral-50 transition-colors appearance-none cursor-pointer ${
              error ? 'border-red-500 focus:border-red-500' : ''
            } ${className}`}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-neutral-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </div>
        {error && (
          <span className="text-xs text-red-650 mt-0.5">{error}</span>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
