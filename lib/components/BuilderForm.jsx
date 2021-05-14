import React, { useEffect, useState } from 'react'
import { PRIZE_POOL_TYPES } from '@pooltogether/current-pool-data'

import { Button } from 'lib/components/Button'
import { LoadingRing } from 'lib/components/LoadingRing'
import { PrizePeriodCard } from 'lib/components/PrizePeriodCard'
import { PrizePoolCard } from 'lib/components/PrizePoolCard'
import { FairnessCard } from 'lib/components/FairnessCard'
import { NumberOfWinnersCard } from 'lib/components/NumberOfWinnersCard'
import { RNGCard } from 'lib/components/RNGCard'
import { TokenDetailsCard } from 'lib/components/TokenDetailsCard'

// TODO: Update this to use the getKnownYieldSourceContract() function in @pooltogether/utilties
const getYieldSourceLabel = (prizePool) => {
  let label = ''

  const sourceLabel = prizePool?.yieldProtocol?.label?.split('-')?.[1]?.trim()

  // Aave is a special case right now as it's a known custom yield source, not a compound-compatible source
  const isAave = prizePool.type === PRIZE_POOL_TYPES.genericYield && sourceLabel?.match('Aave')
  const isCompound = prizePool.type === PRIZE_POOL_TYPES.compound
  const isGenericYield = prizePool.type === PRIZE_POOL_TYPES.genericYield
  const isStake = prizePool.type === PRIZE_POOL_TYPES.stake

  if (isCompound || isAave) {
    label = sourceLabel
  } else if (isStake) {
    label = 'Stake'
  } else if (isGenericYield) {
    label = 'Custom Yield'
  }

  if (label.match('Rari Fuse')) {
    return 'Rari Fuse Yield'
  } else if (label.match('Aave')) {
    return 'Aave Yield'
  } else {
    return label
  }
}

const joinText = (array, separator = ' ') => array.filter(Boolean).join(separator)

export const BuilderForm = (props) => {
  const { handleSubmit, vars, stateSetters } = props

  const {
    depositToken,
    prizePool,
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

  const [errorDeterminingPrizePoolType, setErrorDeterminingPrizePoolType] = useState(false)
  const [loadingPrizePoolData, setLoadingPrizePoolData] = useState(false)

  const [userChangedCreditMaturation, setUserChangedCreditMaturation] = useState(false)
  const [userChangedTicketName, setUserChangedTicketName] = useState(false)
  const [userChangedTicketSymbol, setUserChangedTicketSymbol] = useState(false)
  const [userChangedSponsorshipName, setUserChangedSponsorshipName] = useState(false)
  const [userChangedSponsorshipTicker, setUserChangedSponsorshipTicker] = useState(false)

  const label = depositToken?.tokenSymbol
  const yieldSourceLabel = getYieldSourceLabel(prizePool)
  const prizePoolName = yieldSourceLabel?.split(' ')?.[0]
  const prizePoolSymbol = yieldSourceLabel?.substr(0, 1).toLowerCase()

  /**
   * Updates Token name & ticker symbol as well as Sponsorship
   * token name and ticker symbol if the user hasn't manually edited them.
   * @param {*} prizePoolType PRIZE_POOL_TYPES
   * @param {*} assetSymbol
   */
  const updateTicketLabels = (prizePoolType, assetSymbol = '') => {
    if (!userChangedTicketName) {
      setTicketName(joinText(['PT', prizePoolName, assetSymbol, 'Ticket']))
    }
    if (!userChangedSponsorshipName) {
      setSponsorshipName(joinText(['PT', prizePoolName, assetSymbol, 'Sponsorship']))
    }
    if (!userChangedTicketSymbol) {
      setTicketSymbol(joinText(['PT', prizePoolSymbol, assetSymbol], ''))
    }
    if (!userChangedSponsorshipTicker) {
      setSponsorshipSymbol(joinText(['S', prizePoolSymbol, assetSymbol], ''))
    }
  }

  const getTicketLabel = () => {
    const prefix = yieldSourceLabel?.substr(0, 1).toLowerCase() ?? ''

    return `${prefix}${label?.substr(0, 5)}`
  }

  useEffect(() => {
    if (prizePool && depositToken) {
      const ticketLabel = getTicketLabel()

      switch (prizePool.type) {
        case PRIZE_POOL_TYPES.compound: {
          updateTicketLabels(prizePool.type, ticketLabel)
          break
        }
        case PRIZE_POOL_TYPES.stake: {
          updateTicketLabels(prizePool.type, ticketLabel)
          break
        }
        case PRIZE_POOL_TYPES.genericYield: {
          updateTicketLabels(prizePool.type, ticketLabel)
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
      <PrizePoolCard
        {...props}
        errorDeterminingPrizePoolType={errorDeterminingPrizePoolType}
        setErrorDeterminingPrizePoolType={setErrorDeterminingPrizePoolType}
        setLoadingPrizePoolData={setLoadingPrizePoolData}
        setDepositToken={setDepositToken}
        setPrizePool={setPrizePool}
      />
      {loadingPrizePoolData && (
        <div style={{ marginTop: -50 }}>
          <div className='bg-card rounded-b-lg py-6 sm:pt-0 text-center'>
            <LoadingRing />
          </div>
        </div>
      )}

      {Boolean(prizePool.type) && !errorDeterminingPrizePoolType && (
        <>
          <TokenDetailsCard
            {...props}
            yieldSourceLabel={yieldSourceLabel}
            errorDeterminingPrizePoolType={errorDeterminingPrizePoolType}
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

          <div className='sm:flex mt-10 mb-4 sm:mb-10'>
            <Button
              className='w-full sm:w-1/3 sm:ml-auto'
              backgroundColorClasses='bg-green hover:bg-highlight-4 active:bg-highlight-5'
              color='green'
              id='_createNewPrizePool'
              onClick={handleSubmit}
            >
              Create prize pool
            </Button>
          </div>
        </>
      )}
    </>
  )
}
