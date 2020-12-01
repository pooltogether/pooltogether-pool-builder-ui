import { Card } from 'lib/components/Card'
import { DropdownInputGroup } from 'lib/components/DropdownInputGroup'
import { InputLabel } from 'lib/components/InputLabel'
import { RadioInputGroup } from 'lib/components/RadioInputGroup'
import React, { useState } from 'react'

export const RNGCard = (props) => {
  const { setRngService, rngService } = props

  const [currentRngService, setCurrentRngService] = useState(rngService)

  const rngServices = {
    blockhash: {
      value: 'blockhash',
      view: 'Blockhash',
    },
    chainlink: {
      value: 'chainlink',
      view: 'Chainlink',
    },
  }

  const formatValue = (key) => rngServices[key].view

  const onValueSet = (newToken) => {
    setCurrentRngService(newToken)
    setRngService(newToken)
  }

  return (
    <Card>
      <InputLabel
        primary='Random Number Generator (RNG) Service'
        description='Service used to determine a winner.'
      >
        <DropdownInputGroup
          id='rng-dropdown'
          placeHolder='Select a random number generator service'
          label={'Random number generator service'}
          formatValue={formatValue}
          onValueSet={onValueSet}
          current={currentRngService}
          values={rngServices}
        />
      </InputLabel>
    </Card>
  )
}
