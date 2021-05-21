import { getChain } from '@pooltogether/evm-chains-extended'
import { useOnboard } from '@pooltogether/hooks'

import { SUPPORTED_NETWORKS } from 'lib/constants'

export const useWalletNetwork = (props) => {
  const { network: walletChainId, walletName } = useOnboard()

  const walletConnected = Boolean(walletChainId) && Boolean(walletName)
  const walletOnUnsupportedNetwork = walletConnected && !SUPPORTED_NETWORKS.includes(walletChainId)

  let walletNetworkData = {}
  try {
    walletNetworkData = getChain(walletChainId)
  } catch (error) {}

  return {
    walletChainId,
    walletOnUnsupportedNetwork,
    walletConnected,
    walletName,
    walletNetworkShortName: walletNetworkData?.name || 'unknown network',
    walletNetwork: {
      ...walletNetworkData
    }
  }
}
