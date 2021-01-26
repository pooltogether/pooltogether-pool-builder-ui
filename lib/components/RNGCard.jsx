import React, { useState } from 'react'
import {
  DropdownInputGroup,
  InputLabel,
  Card
} from '@pooltogether/pooltogether-react-tailwind-ui'

export const RNGCard = (props) => {
  const { setRngService, rngService } = props

  const [currentRngService, setCurrentRngService] = useState(rngService)

  const rngServices = {
    blockhash: {
      value: 'blockhash',
      view: 'Blockhash'
    },
    chainlink: {
      value: 'chainlink',
      view: 'Chainlink'
    }
  }

  const formatValue = (key) => rngServices[key].view

  const onValueSet = (newToken) => {
    setCurrentRngService(newToken)
    setRngService(newToken)
  }

  let rngDetailsDescription
  if (currentRngService === 'blockhash') {
    rngDetailsDescription =
      'The Blockhash RNG uses a future blockhash as the random number. This is the least secure method of random number generation, but also the simplest and cheapest.'
  } else if (currentRngService === 'chainlink') {
    rngDetailsDescription = (
      <>
        This uses ChainLink to generate a random number for your prize pool, it is more secure than
        using the blockhash but <b>requires a payment of 2 LINK tokens for each prize awarded</b>.
      </>
    )
  } else {
    rngDetailsDescription =
      'Choose the source of randomness the prize pool will use. This can be changed after pool creation. '
  }

  return (
    <Card>
      <InputLabel
        primary='Random Number Generator (RNG) Service'
        description={rngDetailsDescription}
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
