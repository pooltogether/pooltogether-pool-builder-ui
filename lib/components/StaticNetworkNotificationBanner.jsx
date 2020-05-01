import React, { useContext } from 'react'
import classnames from 'classnames'

import { WalletOnboardContext } from 'lib/components/OnboardState'

export const StaticNetworkNotificationBanner = ({
}) => {
  let chainId
  const walletOnboardContext = useContext(WalletOnboardContext)
  const { onboardState } = walletOnboardContext || {}

  let currentState = {}
  if (onboardState) {
    currentState = onboardState.onboard.getState()
    chainId = currentState.network
  }

  if (!chainId) {
    return null
  }

  let networkWords = 'mainnet 🥵'
  if (chainId === 42) {
    networkWords = `the Kovan testnet 👍`
  }
  console.log(chainId === 42)

  return <div
    className={classnames(
      'text-white text-sm sm:text-base lg:text-lg sm:px-6 py-2 sm:py-3',
      {
        'bg-red-800': chainId === 1,
        'bg-purple-1000': chainId === 42,
      }
    )}
  >
    <div
      className='text-center'
    >
      This only works on Kovan.
      Your wallet is currently set to <span className='font-bold'>{networkWords}</span>
    </div>
  </div>
}