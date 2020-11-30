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
      description='Toggles for fairness.'
    >
      <TextInputGroup
        id='_ticketCreditLimitPercentage'
        containerClassName='w-full sm:w-1/2'
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
    </InputLabel>

    <Collapse title='Advanced Settings' className='mt-4 sm:mt-8' >
      <InputLabel 
        secondary='Fee decay time'
        description='Duration in days. Defaults to 1x the Prize Period.'
        className="mb-8"
      >
        <TextInputGroup
          id='_creditMaturationInDays'
          containerClassName='w-full sm:w-1/2'
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
      </InputLabel>
    </Collapse>
</Card>
}