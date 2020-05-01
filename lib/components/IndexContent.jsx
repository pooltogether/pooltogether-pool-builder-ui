import React, { useContext } from 'react'

import { Button } from 'lib/components/Button'
import { SRWPPBForm } from 'lib/components/SRWPPBForm'
import { WalletOnboardContext } from 'lib/components/OnboardState'

import PoolIcon from 'assets/images/holidays.svg'

export const IndexContent = (
  props,
) => {
  const walletOnboardContext = useContext(WalletOnboardContext)
  const { onboardState } = walletOnboardContext || {}

  let currentState = {}
  if (onboardState) {
    currentState = onboardState.onboard.getState()
  }

  const handleConnect = (e) => {
    e.preventDefault()

    if (walletOnboardContext && walletOnboardContext.onboardState) {
      walletOnboardContext.handleConnectWallet(walletOnboardContext.onboardState)
    }
  }

  return <>
    <div
      className='mt-10 mb-10 sm:mb-20 lg:w-2/3'
    >
      <div
        className='text-blue-300 title text-xl sm:text-3xl'
      >
        SingleRandomWinner PrizePoolBuilder <img src={PoolIcon} className='inline-block w-10 h-10 ml-2' />
      </div>

      <p className='text-purple-100 my-4'>
        This builder creates a new Prize Pool that uses a Single Random Winner prize strategy. This strategy awards the prize periodically to a randomly selected winner.
      </p>

      <a
        href='https://docs.pooltogether.com/contracts/builders'
        className='trans'
      >View documentation</a>
    </div>

    {currentState.address ?
      <SRWPPBForm
        {...props}
      /> :
      <Button
        color='green'
        className='button'
        onClick={handleConnect}
      >
        Connect Wallet
      </Button>
    }
  </>
}
