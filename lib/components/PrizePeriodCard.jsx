import { Card } from 'lib/components/Card'
import { InputLabel } from 'lib/components/InputLabel'
import { TextInputGroup, TextInputGroupType } from 'lib/components/TextInputGroup'
import React from 'react'

export const PrizePeriodCard = (props) => {
  const {
    userChangedCreditMaturation,
    setCreditMaturationInDays,
    setPrizePeriodInDays,
    prizePeriodInDays,
  } = props

  return (
    <Card>
      <InputLabel primary='Prize Period' description='The prize period of the Prize Strategy.'>
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
          pattern='\d+'
          onChange={(e) => {
            if (!userChangedCreditMaturation) {
              setCreditMaturationInDays(e.target.value)
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
