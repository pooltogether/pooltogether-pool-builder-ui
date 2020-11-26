import React from 'react'

export const InputCard = (props) => {
  const { title, description, children } = props

  return (
    <div className='bg-default py-2 px-6 sm:py-4 sm:px-12 rounded-xl w-full mb-4 sm:mb-10'>
      {title && <div className='font-bold mb-2 text-lg sm:text-3xl text-accent-1'>{title}</div>}
      {description && <div className='mb-3 text-sm sm:text-lg text-accent-1'>{description}</div>}
      {children}
    </div>
  )
}
