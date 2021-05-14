import { useQuery } from 'react-query'

import { axiosInstance } from 'lib/axiosInstance'
import { useWalletNetwork } from 'lib/hooks/useWalletNetwork'
import { NETWORK } from 'lib/utils/networks'

const QUERY_KEYS = { coingeckoTokenInfoQuery: 'coingeckoTokenInfoQuery' }
const COINGECKO_TOKEN_INFO_BY_CONTRACT_ADDRESS_LAMBDA_PATH = `/.netlify/functions/coingeckoTokenInfoByContractAddress`

export function useCoingeckoTokenInfoQuery(address) {
  const { walletChainId } = useWalletNetwork()
  const isMainnet = walletChainId === NETWORK.mainnet

  return useQuery([QUERY_KEYS.coingeckoTokenInfoQuery, address], async () => _getInfo(address), {
    enabled: Boolean(address && isMainnet),
    refetchInterval: false,
    refetchOnWindowFocus: false,
    retry: false
  })
}

const _getInfo = async (address) => {
  let data = {}

  try {
    const response = await axiosInstance.get(
      `${COINGECKO_TOKEN_INFO_BY_CONTRACT_ADDRESS_LAMBDA_PATH}?address=${address}`
    )
    data = { ...response.data }
  } catch (error) {
    // console.warn(error)
  }

  return data
}
