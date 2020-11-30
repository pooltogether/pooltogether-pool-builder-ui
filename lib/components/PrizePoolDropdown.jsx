import React, { useState } from 'react'

import { DropdownInputGroup } from 'lib/components/DropdownInputGroup'
import { PRIZE_POOL_TYPE } from 'lib/constants'

export const PrizePoolDropdown = props => {
  const { prizePoolType, updatePrizePoolType } = props

  const [currentPrizePool, setCurrentPrizePool] = useState(prizePoolType)

  const prizePools = {
    compound: {
      value: PRIZE_POOL_TYPE.compound,
      view: <>Compound Prize Pool</>
    },
    stake: {
      value: PRIZE_POOL_TYPE.stake,
      view: <>Stake Prize Pool</>
    }
  }

  const onValueSet = newPrizePool => {
    setCurrentPrizePool(newPrizePool)
    updatePrizePoolType(newPrizePool)
  }

  const formatValue = key => prizePools[key].view

  return (
    <>
      <DropdownInputGroup
        id='prize-pool-dropdown'
        placeHolder='Select the type of prize pool'
        label={'Prize pool type'}
        formatValue={formatValue}
        onValueSet={onValueSet}
        current={currentPrizePool}
        values={prizePools}
      />
    </>
  )
}
