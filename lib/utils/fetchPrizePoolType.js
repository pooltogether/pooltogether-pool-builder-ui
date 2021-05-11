import { PRIZE_POOL_TYPE } from 'lib/constants'
import { fetchCompoundTokenData } from 'lib/utils/fetchCompoundTokenData'
import { fetchTokenChainData } from 'lib/utils/fetchTokenChainData'
import { fetchYieldSourceChainData } from 'lib/utils/fetchYieldSourceChainData'

export const fetchPrizePoolType = async (provider, address) => {
  let data
  console.log('running fetchPrizePoolType')

  // Check if input entered is a Compound prize pool with cToken and underlying token
  try {
    console.log('1. TRY COMPOUND')
    data = await fetchCompoundTokenData(provider, address)
    console.log('1. GOT COMPOUND')
    console.log(data)
    if (data.tokenName) {
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
    console.log('2. TRY CUSTOM')
    data = await fetchYieldSourceChainData(provider, address)
    console.log('2. GOT CUSTOM')
    console.log({ data })

    if (data.tokenName) {
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
    console.log('3. TRY ERC20')
    data = await fetchTokenChainData(provider, address)
    console.log('3. GOT ERC20')

    if (data.tokenName) {
      return {
        prizePoolType: PRIZE_POOL_TYPE.stake,
        depositToken: data
      }
    }
  } catch (e) {
    console.warn(e)
  }

  return { prizePoolType: PRIZE_POOL_TYPE.error }
}
