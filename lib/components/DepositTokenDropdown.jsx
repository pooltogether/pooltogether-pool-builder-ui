import React from 'react'

import { SelectInputGroup } from 'lib/components/SelectInputGroup'
import { useWalletNetwork } from 'lib/hooks/useWalletNetwork'

import { groupedOptions } from 'lib/data/depositTokenDropdownData'
import { PRIZE_POOL_TYPE } from 'lib/constants'

export const DepositTokenDropdown = (props) => {
  const { updatePrizePoolType, updateDepositToken } = props

  const { walletChainId } = useWalletNetwork()

  const options = groupedOptions[walletChainId]

  const determinePrizePoolType = async (address) => {
    console.log('fetch data')
    console.log(address)

    return PRIZE_POOL_TYPE.compound
  }

  const handleInputChange = (newValue) => {
    if (!newValue) {
      return
    }

    console.log(newValue)
    const isValidEthAddress = false
    if (isValidEthAddress) {
    }
  }

  const handleChange = async (selectedOption) => {
    console.log(selectedOption)
    const address = selectedOption.value
    updateDepositToken(selectedOption)

    const prizePoolType = await determinePrizePoolType(address)
    updatePrizePoolType(prizePoolType, selectedOption)
    // setPrizePoolType(prizePoolType)
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
