import { Card } from 'lib/components/Card'
import classnames from 'classnames'
import { DropdownInputGroup } from 'lib/components/DropdownInputGroup'
import { InputLabel } from 'lib/components/InputLabel'
import React, { useState } from 'react'

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

  const rngDetailsDescription = classnames(
    'PoolTogether uses a request-based Random Number Generator interface with a third party service.',
    {
      'The Blockhash RNG uses a future blockhash as the random number. This is the least secure method of random number generation, but also the simplest and cheapest.':
        currentRngService === 'blockhash',
      'ChainLink has implemented their VRF using public key cryptography. NOTE: You must fund the Prize Strategy with LINK tokens.':
        currentRngService === 'chainlink'
    }
  )

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
