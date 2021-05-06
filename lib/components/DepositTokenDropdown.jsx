import React from 'react'

import { SelectInputGroup } from 'lib/components/SelectInputGroup'
import { useWalletNetwork } from 'lib/hooks/useWalletNetwork'

import { groupedOptions } from 'lib/data/depositTokenDropdownData'
import { PRIZE_POOL_TYPE } from 'lib/constants'

export const DepositTokenDropdown = (props) => {
  const { updatePrizePoolType } = props

  const { walletChainId } = useWalletNetwork()

  const options = groupedOptions[walletChainId]

  // const prizePools = {
  //   stake: {
  //     value: PRIZE_POOL_TYPE.stake,
  //     label: <>Stake Prize Pool</>
  //   },
  //   yield: {
  //     value: PRIZE_POOL_TYPE.yield,
  //     label: <>Yield Prize Pool (Custom Yield Source)</>
  //   }

  // if (CONTRACT_ADDRESSES[walletChainId]?.COMPOUND) {
  //   prizePools.compound = {
  //     value: PRIZE_POOL_TYPE.compound,
  //     view: <>Yield Prize Pool (Compound Protocol)</>
  //   }
  // }

  const handleInputChange = (newValue) => {
    console.log(newValue)
  }

  const handleChange = async (selectedOption) => {
    console.log(selectedOption)
    const address = selectedOption.value

    setCurrentPrizePool(newPrizePool)
    updatePrizePoolType(newPrizePool)

    await determinePrizePoolType(address)

    // updateDepositToken(newDepositToken)

    PRIZE_POOL_TYPE.yield
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
