import React, { useEffect, useState } from 'react'

import { Button } from 'lib/components/Button'
import { PRIZE_POOL_TYPE } from 'lib/constants'
import { TokenDetailsCard } from 'lib/components/TokenDetailsCard'
import { PrizePeriodCard } from 'lib/components/PrizePeriodCard'
import { RNGCard } from 'lib/components/RNGCard'
import { PrizePoolCard } from 'lib/components/PrizePoolCard'
import { FairnessCard } from 'lib/components/FairnessCard'
// import { COMPOUND_TOKENS } from 'lib/components/TokenDropdown'
import { NumberOfWinnersCard } from 'lib/components/NumberOfWinnersCard'

const getPrizePoolName = (prizePoolType) => {
  switch (prizePoolType) {
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

const getPrizePoolSymbol = (prizePoolType) => {
  switch (prizePoolType) {
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
  const { resetState, handleSubmit, vars, stateSetters } = props

  const {
    depositToken,
    prizePool,
    cToken,
    rngService,
    prizePeriodInDays,
    creditMaturationInDays,
    ticketCreditLimitPercentage,
    numberOfWinners,
    prizePeriodStartAt
  } = vars

  const {
    setDepositToken,
    setPrizePool,
    setCToken,
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
   * @param {*} prizePoolType PRIZE_POOL_TYPE
   * @param {*} assetSymbol
   */
  const updateTicketLabels = (prizePoolType, assetSymbol = '') => {
    if (!userChangedTicketName) {
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
    const label = _depositToken.tokenSymbol
    return `c${label.substr(0, 5)}`
  }

  useEffect(() => {
    if (prizePool && depositToken) {
      switch (prizePool.type) {
        case PRIZE_POOL_TYPE.compound: {
          const cToken = prizePool.yieldProtocol.value
          setCToken(cToken)
          updateTicketLabels(prizePool.type, getPrizePoolLabel(depositToken))
          break
        }
        case PRIZE_POOL_TYPE.stake: {
          updateTicketLabels(prizePool.type, '')
          break
        }
        case PRIZE_POOL_TYPE.customYield: {
          updateTicketLabels(prizePool.type, '')
          break
        }
      }
    }
  }, [prizePool, depositToken])

  return (
    <>
      <div className='font-bold mb-4 sm:mb-6 text-lg sm:text-5xl text-accent-1'>
        Prize Pool Parameters
      </div>

      <PrizePoolCard {...props} setDepositToken={setDepositToken} setPrizePool={setPrizePool} />

      {Boolean(prizePool.type) && prizePool.type !== PRIZE_POOL_TYPE.error && (
        <>
          <TokenDetailsCard
            {...props}
            cToken={cToken}
            setUserChangedTicketName={setUserChangedTicketName}
            setUserChangedTicketSymbol={setUserChangedTicketSymbol}
            setUserChangedSponsorshipName={setUserChangedSponsorshipName}
            setUserChangedSponsorshipTicker={setUserChangedSponsorshipTicker}
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
              onClick={handleSubmit}
            >
              Create New Prize Pool
            </Button>
          </div>
        </>
      )}
    </>
  )
}
