import React from 'react'

export const ParameterCard = props => {
  const { title, description, children } = props

  return (
    <div className='bg-default -mx-8 sm:-mx-0 sm:mx-auto py-4 px-12 sm:p-10 pb-16 rounded-xl sm:w-full lg:w-3/4 text-base sm:text-lg mb-20'>
      <div className='font-bold mb-8 py-2 text-lg sm:text-xl lg:text-2xl text-default'>
        {title}
      </div>
      <div className='font-bold mb-8 py-2 text-lg sm:text-xl lg:text-2xl text-default'>
        {description}
      </div>
    </div>
  )
}
