import { batch, contract } from '@pooltogether/etherplex'

import CTokenAbi from 'CTokenAbi'

import { fetchTokenChainData } from 'lib/utils/fetchTokenChainData'

export const fetchCompoundTokenData = async (provider, erc20ContractAddress) => {
  try {
    const etherplexTokenContract = contract('ctoken', CTokenAbi, erc20ContractAddress)

    const values = await batch(provider, etherplexTokenContract.underlying().isCToken())
    const underlyingAddress = values.ctoken.underlying[0]

    const underlying = await fetchTokenChainData(provider, underlyingAddress)

    return {
      ...underlying,
      tokenAddress: underlyingAddress
    }
  } catch (e) {
    console.warn(e.message)
    return {}
  }
}
