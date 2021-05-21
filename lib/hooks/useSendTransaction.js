import { useCallback } from 'react'
import { useOnboard } from '@pooltogether/hooks'

import { useNetwork } from 'lib/hooks/useNetwork'
import { callTransaction } from 'lib/utils/callTransaction'
import { poolToast } from 'lib/utils/poolToast'

export const useSendTransaction = function () {
  const { address: usersAddress, provider } = useOnboard()
  const { walletMatchesNetwork } = useNetwork()

  const sendTx = useCallback(
    async (setTx, contractAddress, contractAbi, method, txName, params = []) => {
      if (!walletMatchesNetwork) {
        poolToast.error('Your current network does not match the network which this pool lives on.')
        return
      }

      return callTransaction(
        setTx,
        provider,
        usersAddress,
        contractAddress,
        contractAbi,
        method,
        txName,
        params
      )
    },
    [walletMatchesNetwork]
  )

  return sendTx
}
