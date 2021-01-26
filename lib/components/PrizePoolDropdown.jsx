import React, { useState } from 'react'
import { DropdownInputGroup } from '@pooltogether/pooltogether-react-tailwind-ui'

import { PRIZE_POOL_TYPE } from 'lib/constants'

export const PrizePoolDropdown = (props) => {
  const { prizePoolType, updatePrizePoolType } = props

  const [currentPrizePool, setCurrentPrizePool] = useState(prizePoolType)

  const prizePools = {
    compound: {
      value: PRIZE_POOL_TYPE.compound,
      view: <>Yield Prize Pool (Compound Protocol)</>
    },
    stake: {
      value: PRIZE_POOL_TYPE.stake,
      view: <>Stake Prize Pool</>
    }
  }

  const onValueSet = (newPrizePool) => {
    setCurrentPrizePool(newPrizePool)
    updatePrizePoolType(newPrizePool)
  }

  const formatValue = (key) => prizePools[key].view

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
