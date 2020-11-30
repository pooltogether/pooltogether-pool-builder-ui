import { Card } from 'lib/components/Card'
import { Collapse } from 'lib/components/Collapse'
import { InputLabel } from 'lib/components/InputLabel'
import { RadioInputGroup } from 'lib/components/RadioInputGroup'
import { TextInputGroup, TextInputGroupType } from 'lib/components/TextInputGroup'
import React from 'react'


export const FairnessCard = (props) => {
  const {

    setTicketCreditLimitPercentage,
    ticketCreditLimitPercentage,
    setUserChangedCreditMaturation,
    setCreditMaturationInDays,
    creditMaturationInDays
  } = props

  return <Card>
    <InputLabel 
      primary='Fairness'
      secondary='Early exit fee & fee decay time'
      description='Toggles for fairness.'
    >
      <div className='flex flex-col sm:flex-row sm:mb-4'>
        <TextInputGroup
          id='_ticketCreditLimitPercentage'
          containerClassName='w-full sm:w-1/2 sm:mr-2'
          label='Early exit fee'
          required
          type={TextInputGroupType.number}
          pattern='\d+'
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
          pattern='\d+'
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
}