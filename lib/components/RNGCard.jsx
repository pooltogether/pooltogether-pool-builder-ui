import { Card } from 'lib/components/Card'
import { InputLabel } from 'lib/components/InputLabel'
import { RadioInputGroup } from 'lib/components/RadioInputGroup'
import React from 'react'


export const RNGCard = (props) => {
  const {
    setRngService,
    rngService
  } = props

  return <Card>
    <InputLabel 
      primary='Random Number Generator (RNG) Service'
      description='Service used to determine a winner.'
    >
      <RadioInputGroup
        name='_rngService'
        onChange={(e) => setRngService(e.target.value)}
        value={rngService}
        radios={[
          {
            value: 'blockhash',
            label: 'Blockhash'
          },
          {
            value: 'chainlink',
            label: 'Chainlink'
          }
        ]}
      />
    </InputLabel>
  </Card>
}