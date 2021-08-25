import React, { useState } from 'react'
import FeatherIcon from 'feather-icons-react'
import classnames from 'classnames'

import { StaticNetworkNotificationBanner } from 'lib/components/StaticNetworkNotificationBanner'

export const NotificationBanners = (props) => {
  return (
    <div className='flex flex-col sticky t-0 z-50'>
      <StaticNetworkNotificationBanner />
    </div>
  )
}

export const NotificationBanner = (props) => {
  const { canClose } = props

  const [userHasClosedBanner, setUserHasClosedBanner] = useState(false)

  if (userHasClosedBanner) return null

  return (
    <div
      className={classnames(
        'text-center sm:text-left text-sm sm:text-base sm:px-6 py-2 sm:py-3 text-white z-50 flex relative',
        props.className
      )}
    >
      <div className='pool-container mx-auto'>
        <div className='sm:px-0 lg:px-12'>{props.children}</div>
      </div>
      {canClose && <CloseBannerButton closeBanner={() => setUserHasClosedBanner(true)} />}
    </div>
  )
}

export const CloseBannerButton = (props) => (
  <button
    className='absolute r-1 t-1 opacity-70 hover:opacity-100 cursor-pointer trans'
    onClick={() => props.closeBanner()}
  >
    <FeatherIcon icon='x' className='h-4 w-4 sm:h-6 sm:w-6' />
  </button>
)
