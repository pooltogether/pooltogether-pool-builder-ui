import { Card } from 'lib/components/Card'
import { Collapse } from 'lib/components/Collapse'
import { InputLabel } from 'lib/components/InputLabel'
import { PrizePoolDropdown } from 'lib/components/PrizePoolDropdown'
import { TextInputGroup, TextInputGroupType } from 'lib/components/TextInputGroup'
import React from 'react'


export const PrizePoolTypeCard = (props) => {
  const { updatePrizePoolType } = props;

  return <Card>
    <InputLabel 
      primary="Pool Type"
    >
      <PrizePoolDropdown 
        updatePrizePoolType={updatePrizePoolType}
      />
    </InputLabel>
  </Card>
}