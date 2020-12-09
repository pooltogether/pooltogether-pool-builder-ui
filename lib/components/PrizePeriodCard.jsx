import React from 'react'

import { Card } from 'lib/components/Card'
import { InputLabel } from 'lib/components/InputLabel'
import { TextInputGroup, TextInputGroupType } from 'lib/components/TextInputGroup'
import { DAYS_STEP, FEE_DECAY_DURATION_COEFFICIENT } from 'lib/constants'

export const PrizePeriodCard = (props) => {
  const {
    userChangedCreditMaturation,
    setCreditMaturationInDays,
    setPrizePeriodInDays,
    prizePeriodInDays
  } = props

  return (
    <Card>
      <InputLabel
        primary='Prize Period'
        description='The period of time until the Prize Strategy awards the payout. This range will repeat indefinitely.'
      >
        <TextInputGroup
          id='_prizePeriodInDays'
          containerClassName='w-full sm:w-1/2'
          label={
            <>
              Prize period <span className='text-default italic'> (in days)</span>
            </>
          }
          required
          type={TextInputGroupType.number}
          min={0}
          step={DAYS_STEP}
          onChange={(e) => {
            if (!userChangedCreditMaturation) {
              setCreditMaturationInDays(e.target.value * FEE_DECAY_DURATION_COEFFICIENT)
            }
            setPrizePeriodInDays(e.target.value)
          }}
          value={prizePeriodInDays}
          unit='days'
        />
      </InputLabel>
    </Card>
  )
}
