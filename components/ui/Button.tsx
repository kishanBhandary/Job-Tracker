import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none'
  
  const variants = {
    primary: 'bg-black text-white hover:bg-neutral-900 border border-black',
    secondary: 'bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-50',
    danger: 'bg-red-600 text-white hover:bg-red-750 border border-red-650 hover:bg-red-700',
    ghost: 'bg-transparent text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
