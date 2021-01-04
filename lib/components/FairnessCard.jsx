import React from 'react'

import { Card } from 'lib/components/Card'
import { InputLabel } from 'lib/components/InputLabel'
import { TextInputGroup, TextInputGroupType } from 'lib/components/TextInputGroup'
import { DAYS_STEP, MAX_EXIT_FEE_PERCENTAGE } from 'lib/constants'
import { Collapse } from 'lib/components/Collapse'

export const FairnessCard = (props) => {
  const {
    setTicketCreditLimitPercentage,
    ticketCreditLimitPercentage,
    setUserChangedCreditMaturation,
    setCreditMaturationInDays,
    creditMaturationInDays,
    numberOfWinners,
    setNumberOfWinners
  } = props

  return (
    <Card>
      <InputLabel
        primary='Fairness'
        secondary='Early exit fee & fee decay time'
        description='When a user deposits, they are instantly eligible to win. To maintain fairness a time decay early exit is enforced. The settings below are recommended for your prize pool but can be manually adjusted if necessary. These can also be changed after your prize pool has been created. All early exit fees accrue to the prize.'
      >
        <div className='flex flex-col sm:flex-row sm:mb-4'>
          <TextInputGroup
            id='_ticketCreditLimitPercentage'
            containerClassName='w-full sm:w-1/2 sm:mr-2'
            label='Early exit fee'
            required
            type={TextInputGroupType.number}
            max={MAX_EXIT_FEE_PERCENTAGE}
            min={0}
            step={1}
            onChange={(e) => {
              setTicketCreditLimitPercentage(e.target.value)
            }}
            value={ticketCreditLimitPercentage}
            unit='% percent'
          />

          <TextInputGroup
            id='_creditMaturationInDays'
            containerClassName='w-full sm:w-1/2 sm:ml-2'
            label='Fee decay time'
            required
            type={TextInputGroupType.number}
            max={21}
            min={0}
            step={DAYS_STEP}
            onChange={(e) => {
              setUserChangedCreditMaturation(true)
              setCreditMaturationInDays(e.target.value)
            }}
            value={creditMaturationInDays}
            unit='days'
          />
        </div>
      </InputLabel>
    </Card>
  )
}
