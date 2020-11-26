import React, { useContext } from 'react'

import { BuilderUI } from 'lib/components/BuilderUI'
import { WalletContext } from 'lib/components/WalletContextProvider'

import Dumbbell from 'assets/images/dumbbell.png'

export const IndexContent = (props) => {
  const walletContext = useContext(WalletContext)

  const handleConnect = (e) => {
    e.preventDefault()

    walletContext.handleConnectWallet()
  }

  const address = walletContext._onboard.getState().address

  return (
    <>
      <div className='flex mt-10 mb-10 sm:mb-20 lg:justify-between'>
        <div>
          <h1 className='text-accent-1 title text-xl sm:text-6xl'>Prize Pool Builder v3.0.0</h1>

          <p className='text-accent-1 text-md sm:text-2xl max-w-3xl'>
            This builder creates a new Prize Pool that uses a Single Random Winner prize strategy.
            This strategy awards the prize periodically to a randomly selected winner.
          </p>

          <a
            href='https://docs.pooltogether.com/protocol/builders'
            className='trans text-xs sm:text-base'
          >
            <button>View documentation</button>
          </a>
        </div>
        <img src={Dumbbell} className='hidden sm:block sm:w-32 lg:w-48 sm:ml-10' style={{height: "min-content"}} />
      </div>

      {address ? (
        <BuilderUI {...props} />
      ) : (
        <div className='flex justify-center'>
          <button
            className='font-bold rounded-full text-green border-2 sm:border-4 border-green hover:text-white hover:bg-purple text-xxs sm:text-base pt-2 pb-2 px-3 sm:px-6 trans'
            onClick={handleConnect}
          >
            Connect Wallet
          </button>
        </div>
      )}
    </>
  )
}
