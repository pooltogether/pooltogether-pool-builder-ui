import React, { useContext } from 'react'
import { isValidAddress } from '@pooltogether/utilities'

import { PRIZE_POOL_TYPE } from 'lib/constants'
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

  const determinePrizePoolType = async (address, selectedOption = null) => {
    console.log(selectedOption)
    updateDepositToken(selectedOption)

    console.log({ selectedOption })
    updatePrizePoolType(null)

    const { prizePoolType, depositToken } = await fetchPrizePoolType(provider, address)

    console.log(prizePoolType)
    if (prizePoolType === PRIZE_POOL_TYPE.error) {
      poolToast.error(`Invalid Staking Token or Custom Yield Source chosen`)
    }

    updatePrizePoolType(prizePoolType, selectedOption)
  }

  const handleInputChange = (newValue) => {
    if (!newValue) {
      return
    }

    const address = newValue
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
