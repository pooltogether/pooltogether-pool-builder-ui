import React from 'react'

import { Button } from 'lib/components/Button'
import { RadioInputGroup } from 'lib/components/RadioInputGroup'
import { TokenDropdown } from 'lib/components/TokenDropdown'
import { PoolTypeSelector } from 'lib/components/PoolTypeSelector'
import { TextInputGroup } from 'lib/components/TextInputGroup'
import { InputCard } from './InputCard'
import { ExpandableCard } from './ExpandableCard'

export const BuilderForm = (props) => {
  const { handleSubmit, vars, stateSetters } = props

  const {
    prizePoolType,
    cToken,
    stakedTokenAddress,
    rngService,
    prizePeriodStartAt,
    prizePeriodInDays,
    sponsorshipName,
    sponsorshipSymbol,
    ticketName,
    ticketSymbol,
    maxExitFeePercentage,
    maxTimelockDurationDays,
    ticketCreditLimitPercentage,
    externalERC20Awards
  } = vars

  const {
    setPrizePoolType,
    setCToken,
    setStakedTokenAddress,
    setRngService,
    setPrizePeriodStartAt,
    setPrizePeriodInDays,
    setSponsorshipName,
    setSponsorshipSymbol,
    setTicketName,
    setTicketSymbol,
    setMaxExitFeePercentage,
    setMaxTimelockDurationDays,
    setTicketCreditLimitPercentage,
    setExternalERC20Awards
  } = stateSetters

  const handleTickerChange = (newToken) => {
    setCToken(newToken)
  }
  const handleRngServiceChange = (e) => {
    setRngService(e.target.value)
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className='font-bold mb-4 sm:mb-6 text-lg sm:text-5xl text-accent-1'>
          Prize Pool Parameters
        </div>

        <PoolTypeSelector
          prizePoolType={prizePoolType}
          setPrizePoolType={setPrizePoolType}
          handleTickerChange={handleTickerChange}
          stakedTokenAddress={stakedTokenAddress}
          setStakedTokenAddress={setStakedTokenAddress}
        />

        {Boolean(prizePoolType) && 
          <>
            <InputCard title='Prize Period' description='The prize period of the Prize Strategy.'>
              <TextInputGroup
                id='_prizePeriodInDays'
                label={
                  <>
                    Prize period <span className='text-default italic'> (in days)</span>
                  </>
                }
                required
                type='number'
                pattern='\d+'
                onChange={(e) => setPrizePeriodInDays(e.target.value)}
                value={prizePeriodInDays}
              />
            </InputCard>

            <InputCard 
              title='Random Number Generator (RNG) Service'
              description='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea.'
            >
              <RadioInputGroup
                name='_rngService'
                onChange={handleRngServiceChange}
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
            </InputCard>

            <InputCard 
              title='Ticket Details'
              description='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea.'
            >
              <TextInputGroup
                id='_ticketName'
                label={
                  <>
                    Ticket Name: <span className='text-default italic'>(eg. 'Ticket')</span>
                  </>
                }
                placeholder='(eg. DAI Ticket)'
                required
                onChange={(e) => setTicketName(e.target.value)}
                value={ticketName}
              />

              <TextInputGroup
                id='_ticketSymbol'
                label={
                  <>
                    Ticket Symbol: <span className='text-default italic'>(eg. 'TICK')</span>
                  </>
                }
                placeholder='(eg. DTICK)'
                required
                onChange={(e) => setTicketSymbol(e.target.value)}
                value={ticketSymbol}
              />
            </InputCard>

            <ExpandableCard title='Advanced Settings'>
              <TextInputGroup
                  id='_sponsorshipName'
                  label={
                    <>
                      Sponsorship Name: <span className='text-default italic'>(eg. 'Sponsorship')</span>
                    </>
                  }
                  placeholder='(eg. DAI Sponsorship)'
                  required
                  onChange={(e) => setSponsorshipName(e.target.value)}
                  value={sponsorshipName}
                />
              
              <TextInputGroup
                  id='_sponsorshipSymbol'
                  label={
                    <>
                      Sponsorship Symbol: <span className='text-default italic'>(eg. 'SPON')</span>
                    </>
                  }
                  placeholder='(eg. DSPON)'
                  required
                  onChange={(e) => setSponsorshipSymbol(e.target.value)}
                  value={sponsorshipSymbol}
                />

              <TextInputGroup
                id='_ticketCreditLimitPercentage'
                label={
                  <>
                    Credit Limit:{' '}
                    <span className='text-default italic'>
                      (a percentage, eg. 10 is 10%)
                    </span>
                  </>
                }
                required
                onChange={(e) => setTicketCreditLimitPercentage(e.target.value)}
                value={ticketCreditLimitPercentage}
              />
              

              <TextInputGroup
                id='_maxExitFeePercentage'
                label={
                  <>
                    Max Exit Fee:{' '}
                    <span className='text-default italic'>
                      (a percentage, eg. 50 is 50%)
                    </span>
                  </>
                }
                required
                onChange={(e) => setMaxExitFeePercentage(e.target.value)}
                value={maxExitFeePercentage}
              />

              <TextInputGroup
                id='_maxTimelockDurationDays'
                label={
                  <>
                    Max Timelock Duration: <span className='text-default italic'>(in days)</span>
                  </>
                }
                required
                onChange={(e) => setMaxTimelockDurationDays(e.target.value)}
                value={maxTimelockDurationDays}
              />

            </ExpandableCard>

            <div className='mt-10 mb-0'>
              <Button 
                className='w-full' 
                backgroundColorClasses='bg-green hover:bg-highlight-4 active:bg-highlight-5'
                color='white'
              >
                Create New Prize Pool
              </Button>
            </div>
          </>
        }
      </form>
    </>
  )
}
