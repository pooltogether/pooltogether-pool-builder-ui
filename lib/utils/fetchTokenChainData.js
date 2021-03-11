import { batch, contract } from '@pooltogether/etherplex'

import ERC20Abi from 'ERC20Abi'

import { DEFAULT_TOKEN_PRECISION } from 'lib/constants'

export const fetchTokenChainData = async (provider, erc20ContractAddress) => {
  try {
    const etherplexTokenContract = contract('token', ERC20Abi, erc20ContractAddress)

    const values = await batch(provider, etherplexTokenContract.decimals().name().symbol())

    let decimals = values.token.decimals[0]
    decimals = decimals === 0 ? DEFAULT_TOKEN_PRECISION : decimals

    return {
      tokenDecimals: decimals,
      tokenName: values.token.name[0],
      tokenSymbol: values.token.symbol[0]
    }
  } catch (e) {
    console.warn(e.message)
    return {}
  }
}
