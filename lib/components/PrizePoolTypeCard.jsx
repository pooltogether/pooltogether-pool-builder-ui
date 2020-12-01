import { Card } from 'lib/components/Card'
import { Collapse } from 'lib/components/Collapse'
import { InputLabel } from 'lib/components/InputLabel'
import { PrizePoolDropdown } from 'lib/components/PrizePoolDropdown'
import { TextInputGroup, TextInputGroupType } from 'lib/components/TextInputGroup'
import React from 'react'

export const PrizePoolTypeCard = (props) => {
  const { prizePoolType, updatePrizePoolType } = props

  return (
    <Card>
      <InputLabel
        primary='Pool Type'
        description='Prize Pools allow funds to be pooled together into a no-loss yield source, such as Compound, and have the yield safely exposed to a separate Prize Strategy.  They are the primary way through which users interact with PoolTogether prize games.'
      >
        <PrizePoolDropdown
          updatePrizePoolType={updatePrizePoolType}
          prizePoolType={prizePoolType}
        />
      </InputLabel>
    </Card>
  )
}
