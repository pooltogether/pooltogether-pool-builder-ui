import React from 'react'

export const InputLabel = (props) => {
  const { title, description, children, className } = props

  return (
    <div className={className}>
      {title && <div className='font-bold mb-2 text-lg sm:text-3xl text-accent-1'>{title}</div>}
      {description && <div className='mb-3 text-sm sm:text-lg text-accent-1'>{description}</div>}
      {children}
    </div>
  )
}
