import React from 'react'

import { WalletInfo } from 'lib/components/WalletInfo'

import PoolLogo from 'assets/images/pooltogether-logo.svg'
import PoolPLogo from 'assets/images/pooltogether-white-mark.svg'

export const Nav = (props) => {
  return (
    <>
      <div className='nav-and-footer-container'>
        <nav className='nav-min-height flex items-center h-full justify-between flex-wrap'>
          <div className='w-2/5 lg:w-1/5 justify-start h-full flex items-center truncate'>
            <a href='/' title={'Back to home'} className='hover:border-transparent'>
              <img
                alt={`PoolTogether Logo`}
                src={PoolLogo}
                className='mr-auto lg:m-0 w-32 hidden sm:block'
              />
              <img
                alt={`PoolTogether P Logo`}
                src={PoolPLogo}
                className='mr-auto lg:m-0 w-6 block sm:hidden'
              />
            </a>
          </div>

          <div className='w-3/5 lg:w-2/5 flex justify-end h-full items-center text-right'>
            <div className='mt-0 sm:mt-0 text-xxs sm:text-xs tracking-wide text-right'>
              <WalletInfo {...props} />
            </div>
          </div>
        </nav>
      </div>
    </>
  )
}
