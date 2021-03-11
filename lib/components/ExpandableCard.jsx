import React, { useState } from 'react'
import FeatherIcon from 'feather-icons-react'
import classnames from 'classnames'
import { Card } from './Card'

export const ExpandableCard = (props) => {
  const { title, children } = props

  const [showContent, setShowContent] = useState(false)

  return (
    <Card>
      <div
        className={classnames('flex justify-between cursor-pointer', {
          'mb-4 sm:mb-8': showContent
        })}
        onClick={() => setShowContent(!showContent)}
      >
        {title && <div className='font-bold text-lg sm:text-3xl text-accent-1'>{title}</div>}
        <FeatherIcon
          icon='chevron-down'
          strokeWidth='0.25rem'
          className={classnames('w-3 h-3 sm:w-5 sm:h-5 my-auto', {
            'rotate-180': showContent
          })}
        />
      </div>
      {showContent && children}
    </Card>
  )
}
