import React, { useState } from 'react'

import { DropdownInputGroup } from 'lib/components/DropdownInputGroup'
import { PRIZE_POOL_TYPE } from 'lib/constants'

export const PrizePoolDropdown = props => {
  const { updatePrizePoolType } = props

  const [currentPrizePool, setCurrentPrizePool] = useState(
    PRIZE_POOL_TYPE.compound
  )

  const prizePools = {
    compound: {
      value: PRIZE_POOL_TYPE.compound,
      label: <>Compound Prize Pool</>
    },
    stake: {
      value: PRIZE_POOL_TYPE.stake,
      label: <>Stake Prize Pool</>
    }
  }

  const onValueSet = newPrizePool => {
    setCurrentPrizePool(newPrizePool)
    updatePrizePoolType(newPrizePool)
  }

  const formatValue = key => {
    const prizePool = prizePools[key]

    return <>{prizePool.label}</>
  }

  return (
    <>
      <DropdownInputGroup
        id='prize-pool-dropdown'
        label={<>{prizePools[currentPrizePool].label}</>}
        formatValue={formatValue}
        onValueSet={onValueSet}
        current={currentPrizePool}
        values={prizePools}
      />
    </>
  )
}
