import { batch, contract } from '@pooltogether/etherplex'
import YieldSourceAbi from '@pooltogether/pooltogether-contracts/abis/YieldSourceInterface'

import { DEFAULT_TOKEN_PRECISION } from 'lib/constants'
import ERC20Abi from 'ERC20Abi'

export const fetchYieldSourceChainData = async (provider, yieldSourceAddress) => {
  try {
    const yieldSourceContract = contract('yieldSource', YieldSourceAbi, yieldSourceAddress)

    const yieldSourceData = await batch(provider, yieldSourceContract.token())
    const yieldSourceTokenAddress = yieldSourceData.yieldSource.token[0]

    const tokenContract = contract('token', ERC20Abi, yieldSourceTokenAddress)

    const tokenData = await batch(provider, tokenContract.decimals().name().symbol())

    let decimals = tokenData.token.decimals[0]
    decimals = decimals === 0 ? DEFAULT_TOKEN_PRECISION : decimals

    return {
      tokenDecimals: decimals,
      tokenName: tokenData.token.name[0],
      tokenSymbol: tokenData.token.symbol[0],
      tokenAddress: yieldSourceTokenAddress
    }
  } catch (e) {
    console.warn(e.message)
    return {}
  }
}
