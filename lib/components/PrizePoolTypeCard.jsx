import React from 'react'
import {
  InputLabel,
  Card
} from '@pooltogether/pooltogether-react-tailwind-ui'

import { PrizePoolDropdown } from 'lib/components/PrizePoolDropdown'

export const PrizePoolTypeCard = (props) => {
  const { prizePoolType, updatePrizePoolType } = props

  return (
    <Card>
      <InputLabel
        primary='Pool Type'
        description='A “Yield Prize Pool” earns yield on deposited tokens which generate the prize. A “Stake Prize Pool” does not earn yield on deposited tokens and the prize must be added manually by the pool creator.'
      >
        <PrizePoolDropdown
          updatePrizePoolType={updatePrizePoolType}
          prizePoolType={prizePoolType}
        />
      </InputLabel>
    </Card>
  )
}
