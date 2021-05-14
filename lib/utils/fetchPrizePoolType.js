import { PRIZE_POOL_TYPES } from '@pooltogether/current-pool-data'

import { fetchCompoundTokenData } from 'lib/utils/fetchCompoundTokenData'
import { fetchTokenChainData } from 'lib/utils/fetchTokenChainData'
import { fetchYieldSourceChainData } from 'lib/utils/fetchYieldSourceChainData'

export const fetchPrizePoolType = async (provider, address) => {
  let data

  // Check if input entered is a Compound prize pool with cToken and underlying token

  try {
    data = await fetchCompoundTokenData(provider, address)

    if (data.tokenName) {
      console.log('1. GOT COMPOUND')
      console.log(data)
      return {
        prizePoolType: PRIZE_POOL_TYPES.compound,
        depositToken: data
      }
    }
  } catch (e) {
    console.warn(e)
  }

  // Check if input entered is a Custom yield source and we can read the depositToken
  try {
    data = await fetchYieldSourceChainData(provider, address)

    if (data.tokenName) {
      console.log('2. GOT CUSTOM')
      console.log({ data })

      return {
        prizePoolType: PRIZE_POOL_TYPES.genericYield,
        depositToken: data
      }
    }
  } catch (e) {
    console.warn(e)
  }

  // Check if input entered is ERC20
  try {
    data = await fetchTokenChainData(provider, address)

    if (data.tokenName) {
      console.log('3. GOT ERC20')
      console.log({ data })

      const depositToken = {
        ...data,
        tokenAddress: address
      }

      return {
        prizePoolType: PRIZE_POOL_TYPES.stake,
        depositToken
      }
    }
  } catch (e) {
    console.warn(e)
  }

  return { error: true }
}
