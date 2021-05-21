import { useMemo } from 'react'
import { getChain } from '@pooltogether/evm-chains-extended'
import { NETWORK } from '@pooltogether/utilities'

import { useWalletNetwork } from 'lib/hooks/useWalletNetwork'
import { getNetworkNameAliasByChainId } from 'lib/utils/networks'

// TODO: Don't return until wallet is ready so we know if there will be a change
// then we won't fetch mainnet, throw it away and fetch what the wallet is connected to
export const useNetwork = () => {
  const { walletChainId } = useWalletNetwork()

  return useMemo(() => getNetwork(walletChainId), [walletChainId])
}

const getNetwork = (walletChainId) => {
  const chainId = walletChainId ? walletChainId : NETWORK.mainnet

  let networkData
  networkData = getChain(chainId)

  let networkName
  networkName = getNetworkNameAliasByChainId(chainId)

  return {
    ...networkData,
    networkName,
    walletMatchesNetwork: walletChainId ? chainId === walletChainId : null
  }
}
