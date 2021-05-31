import React, { useState } from 'react'
import { useOnboard } from '@pooltogether/hooks'

import { Card } from 'lib/components/Card'
import { CONTRACT_ADDRESSES } from 'lib/constants'
import { DropdownInputGroup } from 'lib/components/DropdownInputGroup'
import { InputLabel } from 'lib/components/InputLabel'

export const RNGCard = (props) => {
  const { setRngService, rngService } = props

  const [currentRngService, setCurrentRngService] = useState(rngService)

  const { network } = useOnboard()
  let chainId = 1
  if (network) {
    chainId = network
  }

  const rngServices = {
    blockhash: {
      value: 'blockhash',
      label: 'Blockhash'
    }
  }

  const supportsChainlink = Boolean(CONTRACT_ADDRESSES[chainId].RNG_SERVICE.chainlink)

  if (supportsChainlink) {
    rngServices.chainlink = {
      value: 'chainlink',
      label: 'Chainlink'
    }
  }

  const formatValue = (key) => rngServices[key].label

  const onValueSet = (newToken) => {
    setCurrentRngService(newToken)
    setRngService(newToken)
  }

  const warningClassName = supportsChainlink ? 'text-yellow-2' : ''
  const canBeChangedText = `This can also be changed after pool creation`
  const leastSecureMethodText = (
    <>
      This is <strong>the least secure</strong> method of random number generation
    </>
  )

  let rngDetailsDescription
  if (currentRngService === 'blockhash') {
    rngDetailsDescription = (
      <>
        The Blockhash RNG uses a future blockhash as the random number.{' '}
        {supportsChainlink ? (
          <span className={warningClassName}>{leastSecureMethodText}</span>
        ) : (
          leastSecureMethodText
        )}
        , but also the simplest and cheapest. {canBeChangedText}
        {!supportsChainlink ? <> and is the only method of RNG available on this network.</> : '.'}
      </>
    )
  } else if (currentRngService === 'chainlink') {
    rngDetailsDescription = (
      <>
        This uses ChainLink to generate a random number for your prize pool, it is more secure than
        using the blockhash but <b>requires a payment of 2 LINK tokens for each prize awarded</b>.{' '}
        {canBeChangedText}.
      </>
    )
  } else {
    rngDetailsDescription = (
      <>Choose the source of randomness the prize pool will use. {canBeChangedText}.</>
    )
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
