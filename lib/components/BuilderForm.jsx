import React, { useState } from 'react'

import { Button } from 'lib/components/Button'
import { RadioInputGroup } from 'lib/components/RadioInputGroup'
import { TokenDropdown } from 'lib/components/TokenDropdown'
import { PoolTypeSelector } from 'lib/components/PoolTypeSelector'
import { TextInputGroup } from 'lib/components/TextInputGroup'
import { InputLabel } from './InputLabel'
import { ExpandableCard } from './ExpandableCard'
import { InputCard } from './InputCard'

export const BuilderForm = (props) => {
  const { handleSubmit, vars, stateSetters } = props

  const {
    prizePoolType,
    stakedTokenAddress,
    rngService,
    prizePeriodInDays,
    sponsorshipName,
    sponsorshipSymbol,
    ticketName,
    ticketSymbol,
    creditMaturationInDays,
    maxExitFeePercentage,
    maxTimelockDurationDays,
    ticketCreditLimitPercentage,
  } = vars

  const {
    setPrizePoolType,
    setCToken,
    setStakedTokenAddress,
    setRngService,
    setPrizePeriodInDays,
    setSponsorshipName,
    setSponsorshipSymbol,
    setTicketName,
    setTicketSymbol,
    setCreditMaturationInDays,
    setMaxExitFeePercentage,
    setMaxTimelockDurationDays,
    setTicketCreditLimitPercentage,
  } = stateSetters

  const [userChangedMaxExitFee, setUserChangedMaxExitFee] = useState(false)
  const [userChangedMaxTimelockDuration, setUserChangedMaxTimelockDuration] = useState(false)
  const [userChangedCreditMaturation, setUserChangedCreditMaturation] = useState(false)
  const [userChangedSponsorshipName, setUserChangedSponsorshipName] = useState(false)
  const [userChangedSponsorshipTicker, setUserChangedSponsorshipTicker] = useState(false)
  

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className='font-bold mb-4 sm:mb-6 text-lg sm:text-5xl text-accent-1'>
          Prize Pool Parameters
        </div>

        <PoolTypeSelector
          prizePoolType={prizePoolType}
          setPrizePoolType={setPrizePoolType}
          setCToken={setCToken}
          stakedTokenAddress={stakedTokenAddress}
          setStakedTokenAddress={setStakedTokenAddress}
        />

        {Boolean(prizePoolType) && 
          <>
            <InputCard>
              <InputLabel 
                title='Random Number Generator (RNG) Service'
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
            </InputCard>

            <InputCard>
              <InputLabel title='Prize Period' description='The prize period of the Prize Strategy.'>
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
                  onChange={(e) => {
                    if (!userChangedMaxTimelockDuration) {
                      setMaxTimelockDurationDays(Math.round(e.target.value * 4))
                    }
                    if (!userChangedCreditMaturation) {
                      setCreditMaturationInDays(e.target.value)
                    }
                    setPrizePeriodInDays(e.target.value)
                  }}
                  value={prizePeriodInDays}
                />
              </InputLabel>
            </InputCard>

            <InputCard>
              <InputLabel 
                title='Ticket Details'
                description='A name and a ticker symbol for the ERC20 token created by the Prize Pool for managing a users ticket balance.'
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
                  onChange={(e) => {
                    if (!userChangedSponsorshipName) {
                      setSponsorshipName(`Sponsor ${e.target.value}`)  
                    }
                    setTicketName(e.target.value)
                  }}
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
                  onChange={(e) => {
                    if (!userChangedSponsorshipTicker) {
                      setSponsorshipSymbol(`S${e.target.value}`)  
                    }
                    setTicketSymbol(e.target.value)
                  }}
                  value={ticketSymbol}
                />
              </InputLabel>
            </InputCard>

            <ExpandableCard title='Advanced Settings'>
              <InputLabel 
                title='Sponsorship Details'
                description={`An ERC20 token where users can "sponsor" the prize game by depositing funds that don't make them eligible to win.`}
                className="mb-8"
              >
                <TextInputGroup
                  id='_sponsorshipName'
                  label={
                    <>
                      Sponsorship Name: <span className='text-default italic'>(eg. 'Sponsorship')</span>
                    </>
                  }
                  placeholder='(eg. DAI Sponsorship)'
                  required
                  onChange={(e) => {
                    setUserChangedSponsorshipName(true)
                    setSponsorshipName(e.target.value)
                  }}
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
                  onChange={(e) => {
                    setUserChangedSponsorshipTicker(true)
                    setSponsorshipSymbol(e.target.value)
                  }}
                  value={sponsorshipSymbol}
                />
              </InputLabel>

              <InputLabel 
                title='Credit Limit'
                description='A percentage, eg. 10 is 10%. Defaults to 10%.'
                className="mb-8"
              >
                <TextInputGroup
                  id='_ticketCreditLimitPercentage'
                  required
                  type='number'
                  pattern='\d+'
                  onChange={(e) => {
                    if (!userChangedMaxExitFee) {
                      setMaxExitFeePercentage(Math.round(e.target.value * 4))
                    }
                    setTicketCreditLimitPercentage(e.target.value)
                  }}
                  value={ticketCreditLimitPercentage}
                />
              </InputLabel>

              <InputLabel 
                title='Credit Maturation'
                description='Duration in days. Defaults to 1x the Prize Period.'
                className="mb-8"
              >
                <TextInputGroup
                  id='_creditMaturationInDays'
                  required
                  type='number'
                  pattern='\d+'
                  onChange={(e) => {
                    setUserChangedCreditMaturation(true)
                    setCreditMaturationInDays(e.target.value)
                  }}
                  value={creditMaturationInDays}
                />
              </InputLabel>
              
              <InputLabel 
                title='Max Exit Fee'
                description='A percentage, eg. 10 is 10%. Defaults to 4x the Credit Limit.'
                className="mb-8"
              >
                <TextInputGroup
                  id='_maxExitFeePercentage'
                  required
                  type='number'
                  pattern='\d+'
                  onChange={(e) => {
                    setUserChangedMaxExitFee(true)
                    setMaxExitFeePercentage(e.target.value)
                  }}
                  value={maxExitFeePercentage}
                />
              </InputLabel>

              <InputLabel 
                title='Max Timelock'
                description='Duration in days. Defaults to 4x the Prize Period.'
              >
                <TextInputGroup
                  id='_maxTimelockDurationDays'
                  required
                  type='number'
                  pattern='\d+'
                  onChange={(e) => {
                    setUserChangedMaxTimelockDuration(true)
                    setMaxTimelockDurationDays(e.target.value)
                  }}
                  value={maxTimelockDurationDays}
                />
              </InputLabel>

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
