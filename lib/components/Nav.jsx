import React from 'react'

import { WalletInfo } from 'lib/components/WalletInfo'

import PoolLogo from 'assets/images/pooltogether-logo.svg'
import PoolPLogo from 'assets/images/pooltogether-white-mark.svg'

export const Nav = (props) => {
  return (
    <>
      <div className='nav-and-footer-container'>
        <nav className='nav-min-height flex items-center h-full justify-between flex-wrap'>
          <div className='logo-wrapper justify-start h-full flex items-center truncate'>
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

          <div className='w-4/5 flex justify-end items-center text-right'>
            <WalletInfo {...props} />
          </div>
        </nav>
      </div>
    </>
  )
}
