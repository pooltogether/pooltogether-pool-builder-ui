import React, { useEffect } from 'react'
import { useOnboard } from '@pooltogether/hooks'

import { BuilderUI } from 'lib/components/BuilderUI'
import { UnsupportedNetwork } from 'lib/components/UnsupportedNetwork'
import { useWalletNetwork } from 'lib/hooks/useWalletNetwork'

import Dumbbell from 'assets/images/dumbbell.png'

export const IndexContent = (props) => {
  const { connectWallet, address, wallet, onboard } = useOnboard()
  const { walletOnUnsupportedNetwork } = useWalletNetwork()

  return (
    <>
      <div className='flex sm:flex-row flex-col-reverse mt-10 mb-10 sm:mb-20 lg:justify-between'>
        <div>
          <h1 className='text-accent-1 title text-xl sm:text-3xl'>Prize Pool Builder</h1>

          <p className='text-accent-1 text-base sm:text-xl max-w-3xl'>
            This builder creates new Prize Pools with a prize strategy. This strategy allows prize
            awarding periodically to multiple randomly selected winners.
          </p>

          <a
            href='https://docs.pooltogether.com/protocol/prize-pool/prize-pool-builder'
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
          className='w-32 sm:w-48 mb-4 sm:mb-0 sm:ml-10'
          style={{ height: 'min-content' }}
        />
      </div>

      {address ? (
        <>{walletOnUnsupportedNetwork ? <UnsupportedNetwork /> : <BuilderUI {...props} />}</>
      ) : (
        <div className='flex justify-center'>
          <button
            id='_connectWallet'
            className='font-bold rounded-full text-green-1 border border-green-1 hover:text-white hover:bg-purple-1 text-xxs sm:text-base pt-2 pb-2 px-3 sm:px-6 trans'
            onClick={async () => {
              await connectWallet()
            }}
          >
            Connect Wallet
          </button>
        </div>
      )}
    </>
  )
}
