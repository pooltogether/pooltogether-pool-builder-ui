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
          <h1 className='text-accent-1 title text-xl sm:text-6xl'>Prize Pool Builder v3.1.0</h1>

          <p className='text-accent-1 text-base sm:text-2xl max-w-3xl'>
            This builder creates a new Prize Pool that uses a Single Random Winner prize strategy.
            This strategy awards the prize periodically to a randomly selected winner.
          </p>

          <a
            href='https://docs.pooltogether.com/protocol/builders'
            target='_blank'
            className='trans text-xs sm:text-base no-underline border-0 active:outline-none hover:outline-none focus:outline-none'
          >
            <button className='font-bold rounded-full text-green-1 border border-green-1 hover:text-white hover:bg-lightPurple-1000 text-xxs sm:text-base mt-4 pt-2 pb-2 px-3 sm:px-6 trans'>
              View documentation
            </button>
          </a>
        </div>
        <img
          src={Dumbbell}
          className='hidden sm:block sm:w-32 lg:w-48 sm:ml-10'
          style={{ height: 'min-content' }}
        />
      </div>

      {address ? (
        <BuilderUI {...props} />
      ) : (
        <div className='flex justify-center'>
          <button
            id='_connectWallet'
            className='font-bold rounded-full text-green-1 border border-green-1 hover:text-white hover:bg-purple-1 text-xxs sm:text-base pt-2 pb-2 px-3 sm:px-6 trans'
            onClick={handleConnect}
          >
            Connect Wallet
          </button>
        </div>
      )}
    </>
  )
}
