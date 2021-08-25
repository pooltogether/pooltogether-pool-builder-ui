import React from 'react'
import classnames from 'classnames'
import { getChain } from '@pooltogether/evm-chains-extended'

import { NetworkIcon } from 'lib/components/NetworkIcon'

import { useWalletNetwork } from 'lib/hooks/useWalletNetwork'
import { networkColorClassname } from 'lib/utils/networks'

export const CurrentNetworkInfo = (props) => {
  const { walletChainId } = useWalletNetwork()

  const justify = props.justify ?? 'justify-start'

  let network = {}
  let networkName
  if (walletChainId) {
    try {
      network = getChain(walletChainId)
      networkName = network.name || network.network || 'unknown network'
    } catch (error) {
      // console.warn(error)
    }
  }

  return (
    <span className={`flex items-center ${justify}`}>
      <span className='font-bold mr-1'>Current network:</span>
      <NetworkIcon chainId={walletChainId} />
      <span className={classnames(networkColorClassname(walletChainId), 'inline-block')}>
        {networkName}
      </span>
    </span>
  )
}
