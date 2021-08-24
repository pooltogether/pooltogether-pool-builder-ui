import React from 'react'
import { getChain } from '@pooltogether/evm-chains-extended'

import { SUPPORTED_NETWORKS } from 'lib/constants'
import { NetworkIcon } from 'lib/components/NetworkIcon'
import { NotificationBanner } from 'lib/components/NotificationBanners'
import { useWalletNetwork } from 'lib/hooks/useWalletNetwork'

export const StaticNetworkNotificationBanner = () => {
  const { walletConnected, walletChainId } = useWalletNetwork()
  const networkSupported = SUPPORTED_NETWORKS.includes(walletChainId)

  if (!walletConnected || networkSupported) {
    return null
  }

  return (
    <NotificationBanner className='bg-red-1'>
      <StaticNetworkNotification />
    </NotificationBanner>
  )
}

const StaticNetworkNotification = () => {
  const { walletNetworkShortName, walletChainId } = useWalletNetwork()

  let supportedNames = []
  SUPPORTED_NETWORKS.forEach((networkId) => {
    if (networkId === 31337 || networkId === 31337) {
      return
    }

    const { shortName, network } = getChain(networkId)
    const name = `${shortName} ${network}`

    supportedNames.push(name)
  })

  return (
    <div className='flex flex-col items-center justify-center text-lg'>
      <span>
        PoolTogether works on <b className='capitalize'>{supportedNames.join(', ')}</b>. Your wallet
        is currently set to: <NetworkIcon chainId={walletChainId} />
        <b className='capitalize'>{walletNetworkShortName}</b> 🥵.
      </span>
    </div>
  )
}
