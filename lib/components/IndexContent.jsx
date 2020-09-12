import React, { useContext } from 'react'

import { BuilderUI } from 'lib/components/BuilderUI'
import { WalletContext } from 'lib/components/WalletContextProvider'

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
      className='mt-10 mb-10 sm:mb-20 lg:w-2/3 text-center mx-auto'
    >
      <div className='flex flex-col items-center justify-center'>
        <div
          className='text-default title text-xl sm:text-3xl'
        >
          PoolTogether - Prize Pool Builder
        </div>
        <div
          className='text-primary title text-base sm:text-2xl'
        >
          v3.0.0-alpha.31
        </div>
        {/* <img src={PoolIcon} className='inline-block w-6 h-6 sm:w-10 sm:h-10 ml-2 mb-2 sm:mb-0' /> */}
      </div>

      <p className='text-white my-4 text-sm px-16 sm:px-32'>
        This builder creates a new Prize Pool that uses a Single Random Winner prize strategy. This strategy awards the prize periodically to a randomly selected winner.
      </p>

      <a
        href='https://docs.pooltogether.com/contracts/builders'
        className='trans text-xs sm:text-base'
      >View documentation</a>
    </div>

    {address ?
      <BuilderUI
        {...props}
      /> :
      <div
        className='flex justify-center'
      >
        <button
          className='font-bold rounded-full text-green border-2 sm:border-4 border-green hover:text-white hover:bg-purple text-xxs sm:text-base pt-2 pb-2 px-3 sm:px-6 trans'
          onClick={handleConnect}
        >
          Connect Wallet
        </button>
      </div>
    }
  </>
}
