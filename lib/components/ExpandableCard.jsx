import React, { useState } from 'react'
import ArrowDownSvg from 'assets/images/arrow-down.svg'
import classnames from 'classnames'
import { InputCard } from './InputCard'


export const ExpandableCard = (props) => {
  const { title, children } = props
  
  const [showContent, setShowContent] = useState(false)

  return <InputCard>
    <div 
      className={classnames('flex justify-between cursor-pointer',{
        "mb-4 sm:mb-8": showContent,
      })}
      onClick={() => setShowContent(!showContent)}
    >
      {title && 
        <div className='font-bold text-lg sm:text-3xl text-accent-1'>
          {title}
        </div>
      }
      <img src={ArrowDownSvg} className={
        classnames({
          "rotate-180": showContent,
        })}
      />
    </div>
    {showContent && children}
  </InputCard>
}