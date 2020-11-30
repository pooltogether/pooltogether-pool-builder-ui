import React from 'react'

export const InputLabel = (props) => {
  const { primary, secondary, description, children, className } = props

  return (
    <div className={className}>
      {primary && <div className='font-bold mb-2 sm:mb-6 text-lg sm:text-3xl text-accent-1'>{primary}</div>}
      {secondary && <div className='font-bold mb-2 sm:mb-6 text-base sm:text-2xl text-accent-1'>{secondary}</div>}
      {description && <div className='mb-2 sm:mb-6 text-sm sm:text-lg text-accent-1'>{description}</div>}
      {children}
    </div>
  )
}
