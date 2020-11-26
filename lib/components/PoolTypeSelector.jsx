import { PRIZE_POOL_TYPE } from 'lib/constants'
import React, { useState } from 'react'
import { InputCard } from './InputCard'
import { InputLabel } from './InputLabel'
import { PrizePoolDropdown } from './PrizePoolDropdown'
import { TextInputGroup } from './TextInputGroup'
import { TokenDropdown } from './TokenDropdown'

export const PoolTypeSelector = props => {
  const { setPrizePoolType, ...prizePoolInputProps } = props

  return (
    <>
      <InputCard>
        <InputLabel 
          title="Pool Type"
          description=""
        >
          <PrizePoolDropdown setPrizePoolType={setPrizePoolType} />
        </InputLabel>
      </InputCard>
      <PrizePoolInputs {...prizePoolInputProps} />
    </>
  )
}

const PrizePoolInputs = props => {
  switch (props.prizePoolType) {
    case PRIZE_POOL_TYPE.compound: {
      return (
        <CompoundPrizePoolInputs
          setCToken={props.setCToken}
        />
      )
    }
    case PRIZE_POOL_TYPE.stake: {
      return (
        <StakingPrizePoolInputs
          stakedTokenAddress={props.stakedTokenAddress}
          setStakedTokenAddress={props.setStakedTokenAddress}
        />
      )
    }
  }
}

const CompoundPrizePoolInputs = props => {
  return (
    <InputCard>
      <InputLabel
        title="Deposit Token"
        description=""
      >
        <TokenDropdown onChange={props.setCToken} />
      </InputLabel>
    </InputCard>
  )
}

const StakingPrizePoolInputs = props => {
  return (
    <InputCard>
      <InputLabel
        title="Staked Token Address"
        description=""
      >
        <TextInputGroup
          id='_stakedTokenAddress'
          label={
            <>
              Token Address:{' '}
              <span className='text-default italic'>
                (eg. '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984')
              </span>
            </>
          }
          placeholder='(eg. 0x1f9840a85d5af5bf1d1762f925bdaddc4201f984)'
          required
          onChange={e => props.setStakedTokenAddress(e.target.value)}
          value={props.stakedTokenAddress}
        />
      </InputLabel>
    </InputCard>
  )
}
