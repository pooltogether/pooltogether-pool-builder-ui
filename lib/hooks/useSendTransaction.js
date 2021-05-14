import { useCallback, useContext } from 'react'

import { WalletContext } from 'lib/components/WalletContextProvider'
import { useNetwork } from 'lib/hooks/useNetwork'
import { useUsersAddress } from 'lib/hooks/useUsersAddress'
import { callTransaction } from 'lib/utils/callTransaction'
import { poolToast } from 'lib/utils/poolToast'

export const useSendTransaction = function () {
  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider
  const { walletMatchesNetwork } = useNetwork()
  const usersAddress = useUsersAddress()

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
