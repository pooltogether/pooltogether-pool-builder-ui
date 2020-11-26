import { PRIZE_POOL_TYPE } from 'lib/constants'
import React, { useState } from 'react'
import { InputCard } from './InputCard'
import { PrizePoolDropdown } from './PrizePoolDropdown'
import { TextInputGroup } from './TextInputGroup'
import { TokenDropdown } from './TokenDropdown'

export const PoolTypeSelector = props => {
  const { setPrizePoolType, ...prizePoolInputProps } = props

  return (
    <>
      <InputCard 
        title="Pool Type"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea."
      >
        <PrizePoolDropdown setPrizePoolType={setPrizePoolType} />
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
          handleTickerChange={props.handleTickerChange}
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
    <InputCard
      title="Deposit Token"
      description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea."
    >
      <TokenDropdown onChange={props.handleTickerChange} />
    </InputCard>
  )
}

const StakingPrizePoolInputs = props => {
  return (
    <InputCard
      title="Deposit Token"
      description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea."
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
    </InputCard>
  )
}
