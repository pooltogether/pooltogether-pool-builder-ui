import React from 'react'

export const InputCard = (props) => {
  const { children } = props

  return (
    <div className='bg-default py-3 px-3 sm:py-4 sm:px-12 rounded-xl w-full mb-4 sm:mb-10'>
      {children}
    </div>
  )
}
