import React, { useContext } from 'react'

import { WalletContext } from 'lib/components/WalletContextProvider'
import { SelectInputGroup } from 'lib/components/SelectInputGroup'
import { groupedOptions } from 'lib/data/depositTokenDropdownData'
import { useWalletNetwork } from 'lib/hooks/useWalletNetwork'
import { fetchPrizePoolType } from 'lib/utils/fetchPrizePoolType'

export const DepositTokenDropdown = (props) => {
  const { updatePrizePoolType, updateDepositToken } = props

  const { walletChainId } = useWalletNetwork()

  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider

  const options = groupedOptions[walletChainId]

  const determinePrizePoolType = async (selectedOption) => {
    console.log(selectedOption)
    const address = selectedOption.value
    updateDepositToken(selectedOption)

    console.log({ selectedOption })

    const { prizePoolType } = fetchPrizePoolType(provider, address)

    updatePrizePoolType(prizePoolType, selectedOption)
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
    await determinePrizePoolType(selectedOption)
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
