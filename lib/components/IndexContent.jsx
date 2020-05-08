import React, { useContext } from 'react'

import { Button } from 'lib/components/Button'
import { SRWPPBBuilder } from 'lib/components/SRWPPBBuilder'
import { WalletContext } from 'lib/components/WalletContextProvider'

import PoolIcon from 'assets/images/holidays.svg'

export const IndexContent = (
  props,
) => {
  const walletContext = useContext(WalletContext)

  const handleConnect = (e) => {
    e.preventDefault()

    walletContext.handleConnectWallet()
  }

  const address = walletContext._onboard.getState().address

  return <>
    <div
      className='mt-10 mb-10 sm:mb-20 lg:w-2/3'
    >
      <img src={PoolIcon} className='inline-block w-10 h-10 ml-2' />
      <div
        className='text-blue-400 title text-xl sm:text-3xl'
      >
        Prize Pool Builder
      </div>

      <p className='text-purple-100 my-4'>
        This builder creates a new Prize Pool that uses a Single Random Winner prize strategy. This strategy awards the prize periodically to a randomly selected winner.
      </p>

      <a
        href='https://docs.pooltogether.com/contracts/builders'
        className='trans'
      >View documentation</a>
    </div>

    {address ?
      <SRWPPBBuilder
        {...props}
      /> :
      <div>
        <button
          className='font-bold rounded-full text-green-300 border-2 sm:border-4 border-green-300 hover:text-white hover:bg-lightPurple-900 text-xxs sm:text-base pt-2 pb-2 px-3 sm:px-6 trans'
          onClick={handleConnect}
        >
          Connect Wallet
        </button>
      </div>
    }
  </>
}
