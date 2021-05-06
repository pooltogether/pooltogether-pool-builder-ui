import React, { useState } from 'react'

import { Button } from 'lib/components/Button'
import { PRIZE_POOL_TYPE } from 'lib/constants'
import { TokenDetailsCard } from 'lib/components/TokenDetailsCard'
import { PrizePeriodCard } from 'lib/components/PrizePeriodCard'
import { RNGCard } from 'lib/components/RNGCard'
import { PrizePoolTypeCard } from 'lib/components/PrizePoolTypeCard'
import { FairnessCard } from 'lib/components/FairnessCard'
// import { COMPOUND_TOKENS } from 'lib/components/TokenDropdown'
import { NumberOfWinnersCard } from 'lib/components/NumberOfWinnersCard'

const getPrizePoolName = (prizePool) => {
  switch (prizePool) {
    case PRIZE_POOL_TYPE.compound: {
      return 'Compound'
    }
    case PRIZE_POOL_TYPE.stake: {
      return 'Stake'
    }
    case PRIZE_POOL_TYPE.customYield: {
      return 'Custom Yield Source'
    }
  }
}

const getPrizePoolSymbol = (prizePool) => {
  switch (prizePool) {
    case PRIZE_POOL_TYPE.compound: {
      return 'C'
    }
    case PRIZE_POOL_TYPE.stake: {
      return 'S'
    }
    case PRIZE_POOL_TYPE.customYield: {
      return 'Y'
    }
  }
}

const joinText = (array, separator = ' ') => array.filter(Boolean).join(separator)

export const BuilderForm = (props) => {
  const { handleSubmit, vars, stateSetters } = props

  const {
    depositToken,
    prizePoolType,
    cToken,
    stakedTokenData,
    stakedTokenAddress,
    yieldSourceData,
    yieldSourceAddress,
    rngService,
    prizePeriodInDays,
    sponsorshipName,
    sponsorshipSymbol,
    ticketName,
    ticketSymbol,
    creditMaturationInDays,
    ticketCreditLimitPercentage,
    numberOfWinners,
    prizePeriodStartAt
  } = vars

  const {
    setDepositToken,
    setPrizePoolType,
    setCToken,
    setStakedTokenData,
    setStakedTokenAddress,
    setYieldSourceAddress,
    setYieldSourceData,
    setRngService,
    setPrizePeriodInDays,
    setSponsorshipName,
    setSponsorshipSymbol,
    setTicketName,
    setTicketSymbol,
    setCreditMaturationInDays,
    setTicketCreditLimitPercentage,
    setNumberOfWinners,
    setPrizePeriodStartAt
  } = stateSetters

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
  const updateTicketLabels = (prizePoolType, assetSymbol = '') => {
    if (!userChangedTicketName) {
      console.log('hi')
      setTicketName(joinText(['PT', getPrizePoolName(prizePoolType), assetSymbol, 'Ticket']))
    }
    if (!userChangedSponsorshipName) {
      setSponsorshipName(
        joinText(['PT', getPrizePoolName(prizePoolType), assetSymbol, 'Sponsorship'])
      )
    }
    if (!userChangedTicketSymbol) {
      setTicketSymbol(joinText(['P', getPrizePoolSymbol(prizePoolType), assetSymbol], ''))
    }
    if (!userChangedSponsorshipTicker) {
      setSponsorshipSymbol(joinText(['S', getPrizePoolSymbol(prizePoolType), assetSymbol], ''))
    }
  }

  const getPrizePoolLabel = (_depositToken) => {
    console.log(_depositToken)
    const label = _depositToken.label
    return `c${label.substr(0, 5)}`
  }

  const getYieldProtocolName = (_depositToken) => {
    return 'Rari Fuse Fill me in!'
  }

  /**
   * Updates the state of the selected Prize Pool type
   * & updates token names
   * @param {*} prizePoolType new Prize Pool Type
   */
  const updatePrizePoolType = (_prizePoolType, _depositToken) => {
    switch (_prizePoolType) {
      case PRIZE_POOL_TYPE.compound: {
        // updateCToken(address)
        updateTicketLabels(_prizePoolType, getPrizePoolLabel(_depositToken))
        break
      }
      case PRIZE_POOL_TYPE.stake: {
        updateTicketLabels(_prizePoolType, '')
        break
      }
      case PRIZE_POOL_TYPE.customYield: {
        updateTicketLabels(_prizePoolType, '')
        break
      }
    }
    setPrizePoolType(_prizePoolType)
  }

  /**
   * Keeps track of the value entered into the deposit token/prize pool type input
   * @param {*} _depositToken Deposit Token Address
   */
  const updateDepositToken = (_depositToken) => {
    setDepositToken(_depositToken)
  }

  /**
   * Updates the state of the selected cToken
   * & updates token names
   * @param {*} cToken new cToken to select
   */
  const updateCToken = (cToken) => {
    // updateTicketLabels(PRIZE_POOL_TYPE.compound, COMPOUND_TOKENS[cToken].value)
    // updateTicketLabels()
    setCToken(cToken)
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className='font-bold mb-4 sm:mb-6 text-lg sm:text-5xl text-accent-1'>
          Prize Pool Parameters
        </div>

        <PrizePoolTypeCard
          updateDepositToken={updateDepositToken}
          updatePrizePoolType={updatePrizePoolType}
        />

        {Boolean(prizePoolType) && (
          <>
            <TokenDetailsCard
              prizePoolType={prizePoolType}
              cToken={cToken}
              depositToken={depositToken}
              updateCToken={updateCToken}
              stakedTokenAddress={stakedTokenAddress}
              stakedTokenData={stakedTokenData}
              setStakedTokenAddress={setStakedTokenAddress}
              setStakedTokenData={setStakedTokenData}
              yieldSourceAddress={yieldSourceAddress}
              yieldSourceData={yieldSourceData}
              setYieldSourceAddress={setYieldSourceAddress}
              setYieldSourceData={setYieldSourceData}
              updateTicketLabels={updateTicketLabels}
              setUserChangedTicketName={setUserChangedTicketName}
              ticketName={ticketName}
              setTicketName={setTicketName}
              setUserChangedTicketSymbol={setUserChangedTicketSymbol}
              ticketSymbol={ticketSymbol}
              setTicketSymbol={setTicketSymbol}
              setUserChangedSponsorshipName={setUserChangedSponsorshipName}
              sponsorshipName={sponsorshipName}
              setSponsorshipName={setSponsorshipName}
              setUserChangedSponsorshipTicker={setUserChangedSponsorshipTicker}
              sponsorshipSymbol={sponsorshipSymbol}
              setSponsorshipSymbol={setSponsorshipSymbol}
              yieldProtocolName={getYieldProtocolName()}
            />

            <RNGCard setRngService={setRngService} rngService={rngService} />

            <PrizePeriodCard
              userChangedCreditMaturation={userChangedCreditMaturation}
              setCreditMaturationInDays={setCreditMaturationInDays}
              setPrizePeriodInDays={setPrizePeriodInDays}
              prizePeriodInDays={prizePeriodInDays}
              prizePeriodStartAt={prizePeriodStartAt}
              setPrizePeriodStartAt={setPrizePeriodStartAt}
            />

            <NumberOfWinnersCard
              numberOfWinners={numberOfWinners}
              setNumberOfWinners={setNumberOfWinners}
            />

            <FairnessCard
              setTicketCreditLimitPercentage={setTicketCreditLimitPercentage}
              ticketCreditLimitPercentage={ticketCreditLimitPercentage}
              setUserChangedCreditMaturation={setUserChangedCreditMaturation}
              setCreditMaturationInDays={setCreditMaturationInDays}
              creditMaturationInDays={creditMaturationInDays}
            />

            <div className='mt-10 mb-4 sm:mb-10'>
              <Button
                className='w-full'
                backgroundColorClasses='bg-green hover:bg-highlight-4 active:bg-highlight-5'
                color='green'
                id='_createNewPrizePool'
              >
                Create New Prize Pool
              </Button>
            </div>
          </>
        )}
      </form>
    </>
  )
}
