import React, { useContext } from 'react'
import { isValidAddress } from '@pooltogether/utilities'

import { PRIZE_POOL_TYPE } from 'lib/constants'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { SelectInputGroup } from 'lib/components/SelectInputGroup'
import { groupedOptions } from 'lib/data/prizePoolDropdownData'
import { useWalletNetwork } from 'lib/hooks/useWalletNetwork'
import { fetchPrizePoolType } from 'lib/utils/fetchPrizePoolType'

export const PrizePoolDropdown = (props) => {
  const { setPrizePool, setDepositToken } = props

  const { walletChainId } = useWalletNetwork()

  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider

  const options = groupedOptions[walletChainId]

  const determinePrizePoolType = async (address, selectedOption = null) => {
    console.log({ selectedOption })
    // updatePrizePool({})
    setPrizePool({})

    const { prizePoolType, depositToken } = await fetchPrizePoolType(provider, address)

    console.log(prizePoolType)
    if (prizePoolType === PRIZE_POOL_TYPE.error) {
      poolToast.error(`Invalid Staking Token or Custom Yield Source chosen`)
    }

    setDepositToken(depositToken)

    const prizePool = {
      type: prizePoolType,
      yieldProtocol: selectedOption
    }
    console.log(prizePool)
    setPrizePool(prizePool)

    // updateDepositToken(depositToken)
    // updatePrizePool()
  }

  const handleInputChange = (newValue) => {
    if (!newValue) {
      return
    }

    const address = newValue.trim()
    if (isValidAddress(address)) {
      const _kickoffDeterminePrizePoolType = async () => {
        console.log('hi')
        await determinePrizePoolType(address)
      }
      _kickoffDeterminePrizePoolType(address)
    }
  }

  const handleChange = async (selectedOption) => {
    const address = selectedOption.value
    await determinePrizePoolType(address, selectedOption)
  }

  return (
    <SelectInputGroup
      id='prize-pool-type-dropdown'
      placeholder='Choose or enter deposit token ...'
      label={'Pool type'}
      options={options}
      handleInputChange={handleInputChange}
      handleChange={handleChange}
    />
  )
}
