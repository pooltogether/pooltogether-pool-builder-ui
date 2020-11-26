import React, { useState } from 'react'

import { Button } from 'lib/components/Button'
import { RadioInputGroup } from 'lib/components/RadioInputGroup'
import { PoolTypeSelector } from 'lib/components/PoolTypeSelector'
import { TextInputGroup } from 'lib/components/TextInputGroup'
import { InputLabel } from './InputLabel'
import { ExpandableCard } from './ExpandableCard'
import { InputCard } from './InputCard'
import { PRIZE_POOL_TYPE } from 'lib/constants'

const getPrizePoolName = (prizePool) => {
  switch(prizePool) {
    case PRIZE_POOL_TYPE.compound: {
      return "Compound"
    }
    case PRIZE_POOL_TYPE.stake: {
      return "Stake"
    }
  }
}

const getPrizePoolSymbol = (prizePool) => {
  switch(prizePool) {
    case PRIZE_POOL_TYPE.compound: {
      return "C"
    }
    case PRIZE_POOL_TYPE.stake: {
      return "S"
    }
  }
}

export const BuilderForm = (props) => {
  const { handleSubmit, vars, stateSetters } = props

  const {
    prizePoolType,
    cToken,
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
  const [userChangedTicketName, setUserChangedTicketName] = useState(false)
  const [userChangedTicketSymbol, setUserChangedTicketSymbol] = useState(false)
  const [userChangedSponsorshipName, setUserChangedSponsorshipName] = useState(false)
  const [userChangedSponsorshipTicker, setUserChangedSponsorshipTicker] = useState(false)

  /**
   * Updates Token name & ticker symbol as well as Sponsorship
   * token name and ticker symbol if the user hasn't manually edited them.
   * @param {*} prizePoolType 
   * @param {*} assetSymbol 
   */
  const updateTicketLabels = (prizePoolType, assetSymbol) => {
    if (!userChangedTicketName) {
      setTicketName(`PT ${getPrizePoolName(prizePoolType)} ${assetSymbol.slice(0,3)}`)
    }
    if (!userChangedSponsorshipName) {
      setSponsorshipName(`PT ${getPrizePoolName(prizePoolType)} ${assetSymbol.slice(0,3)} Sponsorship`)
    }
    if (!userChangedTicketSymbol) {
      setTicketSymbol(`P${getPrizePoolSymbol(prizePoolType)}${assetSymbol.slice(0,3)}`)
    }
    if (!userChangedSponsorshipTicker) {
      setSponsorshipSymbol(`S${getPrizePoolSymbol(prizePoolType)}${assetSymbol.slice(0,3)}`)
    }
  }

  /**
   * Updates the state of the selected Prize Pool type
   * & updates token names
   * @param {*} prizePoolType new Prize Pool Type
   */
  const updatePrizePoolType = (prizePoolType) => {
    switch(prizePoolType) {
      case PRIZE_POOL_TYPE.compound: {
        updateTicketLabels(prizePoolType, cToken)
        break;
      }
      case PRIZE_POOL_TYPE.stake: {
        updateTicketLabels(prizePoolType, "")
        break;
      }
    }
    setPrizePoolType(prizePoolType)
  }

  /**
   * Updates the state of the selected cToken
   * & updates token names
   * @param {*} cToken new cToken to select
   */
  const updateCToken = (cToken) => {
    updateTicketLabels(PRIZE_POOL_TYPE.compound, cToken)
    setCToken(prizePoolType)
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className='font-bold mb-4 sm:mb-6 text-lg sm:text-5xl text-accent-1'>
          Prize Pool Parameters
        </div>

        <PoolTypeSelector
          prizePoolType={prizePoolType}
          updatePrizePoolType={updatePrizePoolType}
          cToken={cToken}
          updateCToken={updateCToken}
          stakedTokenAddress={stakedTokenAddress}
          setStakedTokenAddress={setStakedTokenAddress}
          setTicketName={setTicketName}
          setTicketSymbol={setTicketSymbol}
          setSponsorshipName={setSponsorshipName}
          setSponsorshipSymbol={setSponsorshipSymbol}
          userChangedTicketName={userChangedTicketName}
          userChangedTicketSymbol={userChangedTicketSymbol}
          userChangedSponsorshipName={userChangedSponsorshipName}
          userChangedSponsorshipTicker={userChangedSponsorshipTicker}
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
                      Ticket Name: <span className='text-default italic'>(eg. 'PT Compound Dai Ticket')</span>
                    </>
                  }
                  placeholder='(eg. PT Compound Dai Ticket)'
                  required
                  onChange={(e) => {
                    setUserChangedTicketName(true)
                    setTicketName(e.target.value)
                  }}
                  value={ticketName}
                />

                <TextInputGroup
                  id='_ticketSymbol'
                  label={
                    <>
                      Ticket Symbol: <span className='text-default italic'>(eg. 'PCDAI')</span>
                    </>
                  }
                  placeholder='(eg. PCDAI)'
                  required
                  maxlength="5"
                  onChange={(e) => {
                    setUserChangedTicketSymbol(true)
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
                      Sponsorship Name: <span className='text-default italic'>(eg. 'PT Compound Dai Sponsorship')</span>
                    </>
                  }
                  placeholder='(eg. PT Compound Dai Sponsorship)'
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
                      Sponsorship Symbol: <span className='text-default italic'>(eg. 'SCDAI')</span>
                    </>
                  }
                  placeholder='(eg. SCDAI)'
                  required
                  maxlength="5"
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
