import { PRIZE_POOL_TYPE } from 'lib/constants'
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
        prizePoolType: PRIZE_POOL_TYPE.compound,
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
        prizePoolType: PRIZE_POOL_TYPE.customYield,
        depositToken: data
      }
    }
  } catch (e) {
    console.warn(e)
  }

  // Check if input entered is ERC20
  try {
    data = await fetchTokenChainData(provider, address)
    console.log('3. GOT ERC20')
    console.log({ data })

    if (data.tokenName) {
      const depositToken = {
        ...data,
        tokenAddress: address
      }

      return {
        prizePoolType: PRIZE_POOL_TYPE.stake,
        depositToken
      }
    }
  } catch (e) {
    console.warn(e)
  }

  return { prizePoolType: PRIZE_POOL_TYPE.error }
}
