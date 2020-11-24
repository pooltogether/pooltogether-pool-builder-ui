import { PRIZE_POOL_TYPE } from 'lib/constants'
import React, { useState } from 'react'
import { PrizePoolDropdown } from './PrizePoolDropdown'
import { TextInputGroup } from './TextInputGroup'
import { TokenDropdown } from './TokenDropdown'

export const PoolTypeSelector = props => {
  const { setPrizePoolType, ...prizePoolInputProps } = props

  return (
    <>
      <label
        htmlFor={'prize-pool-dropdown'}
        className='mt-0 trans text-purple-300 hover:text-white'
      >
        Pool type:
      </label>
      <PrizePoolDropdown setPrizePoolType={props.setPrizePoolType} />
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
    <>
      <label
        htmlFor={'token'}
        className='mt-0 trans text-purple-300 hover:text-white'
      >
        Yield service token to use:
      </label>
      <TokenDropdown onChange={props.handleTickerChange} />
    </>
  )
}

const StakingPrizePoolInputs = props => {
  return (
    <>
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
    </>
  )
}
