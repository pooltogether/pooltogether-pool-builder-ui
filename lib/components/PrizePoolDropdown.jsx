import React, { useState } from 'react'
// import { CONTRACT_ADDRESSES } from 'lib/constants'
// import { WalletContext } from 'lib/components/WalletContextProvider'
import { DropdownInputGroup } from 'lib/components/DropdownInputGroup'
import { useWalletNetwork } from 'lib/hooks/useWalletNetwork'
import { PRIZE_POOL_TYPE } from 'lib/constants'

export const PrizePoolDropdown = (props) => {
  const { prizePoolType, updatePrizePoolType } = props

  const [currentPrizePool, setCurrentPrizePool] = useState(prizePoolType)

  const { walletChainId } = useWalletNetwork()

  const prizePools = {
    stake: {
      value: PRIZE_POOL_TYPE.stake,
      label: <>Stake Prize Pool</>
    },
    yield: {
      value: PRIZE_POOL_TYPE.yield,
      label: <>Yield Prize Pool (Custom Yield Source)</>
    }
  }

  // if (CONTRACT_ADDRESSES[walletChainId]?.COMPOUND) {
  //   prizePools.compound = {
  //     value: PRIZE_POOL_TYPE.compound,
  //     view: <>Yield Prize Pool (Compound Protocol)</>
  //   }
  // }

  const onValueSet = (newPrizePool) => {
    setCurrentPrizePool(newPrizePool)
    updatePrizePoolType(newPrizePool)
  }

  const formatValue = (key) => prizePools?.[key]?.label

  return (
    <DropdownInputGroup
      id='prize-pool-dropdown'
      placeHolder='Select the type of prize pool'
      label={'Pool type'}
      formatValue={formatValue}
      onValueSet={onValueSet}
      current={currentPrizePool}
      values={prizePools}
    />
  )
}
