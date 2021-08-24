import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { PRIZE_POOL_TYPES } from '@pooltogether/current-pool-data'
import { useOnboard } from '@pooltogether/hooks'
import { isValidAddress } from '@pooltogether/utilities'
import PoolWithMultipleWinnersBuilderAbi from '@pooltogether/pooltogether-contracts/abis/PoolWithMultipleWinnersBuilder'

import { CONTRACT_ADDRESSES, MAX_EXIT_FEE_PERCENTAGE, TICKET_DECIMALS } from 'lib/constants'
import { BuilderForm } from 'lib/components/BuilderForm'
import { BuilderResultPanel } from 'lib/components/BuilderResultPanel'
import { TxMessage } from 'lib/components/TxMessage'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { useWalletNetwork } from 'lib/hooks/useWalletNetwork'
import { poolToast } from 'lib/utils/poolToast'
import { daysToSeconds, percentageToFraction } from 'lib/utils/format'

const { constants } = ethers

const now = () => Math.floor(new Date().getTime() / 1000)
const toWei = ethers.utils.parseEther
const convertPercentageToSingleDecimalPrecision = (value) => {
  return Number(value) * 10
}

const sendPrizePoolBuilderTx = async (
  sendTx,
  params,
  provider,
  walletChainId,
  setTx,
  setResultingContractAddresses
) => {
  const signer = provider.getSigner()

  const {
    rngService,
    prizePeriodStartAt,
    prizePeriodInDays,
    ticketName,
    ticketSymbol,
    ticketDecimals,
    sponsorshipName,
    sponsorshipSymbol,
    creditMaturationInDays,
    ticketCreditLimitPercentage,
    numberOfWinners,
    prizePool,
    prizeSplitsMerged
  } = params

  const prizePoolType = prizePool.type

  const prizePoolConfig = getPrizePoolConfig(params)

  const prizePoolBuilderAddress =
    CONTRACT_ADDRESSES[walletChainId].POOL_WITH_MULTIPLE_WINNERS_BUILDER
  const prizePoolBuilderContract = new ethers.Contract(
    prizePoolBuilderAddress,
    PoolWithMultipleWinnersBuilderAbi,
    signer
  )

  // Determine appropriate Credit Rate based on Credit Limit / Credit Maturation (in seconds)
  const prizePeriodSeconds = daysToSeconds(prizePeriodInDays)
  const ticketCreditLimitMantissa = percentageToFraction(ticketCreditLimitPercentage).toString()
  const ticketCreditMaturationInSeconds = daysToSeconds(creditMaturationInDays)
  const ticketCreditRateMantissa = ticketCreditMaturationInSeconds
    ? ethers.utils.parseEther(ticketCreditLimitMantissa).div(ticketCreditMaturationInSeconds)
    : ethers.BigNumber.from(0)

  const prizePeriodStartInt = prizePeriodStartAt ? parseInt(prizePeriodStartAt, 10) : 0
  const prizePeriodStartTimestamp = (prizePeriodStartInt === 0
    ? now()
    : prizePeriodStartInt
  ).toString()

  const rngServiceAddress = CONTRACT_ADDRESSES[walletChainId].RNG_SERVICE[rngService]

  const multipleRandomWinnersConfig = {
    rngService: rngServiceAddress,
    prizePeriodStart: prizePeriodStartTimestamp,
    prizePeriodSeconds,
    ticketName,
    ticketSymbol,
    sponsorshipName,
    sponsorshipSymbol,
    ticketCreditLimitMantissa: toWei(ticketCreditLimitMantissa),
    ticketCreditRateMantissa,
    splitExternalErc20Awards: prizePoolType === PRIZE_POOL_TYPES.stake ? true : false,
    numberOfWinners,
    prizeSplits: prizeSplitsMerged
  }

  const tx = await sendTx(
    setTx,
    prizePoolBuilderAddress,
    PoolWithMultipleWinnersBuilderAbi,
    getTxMethod(prizePoolType),
    'Create pool',
    [prizePoolConfig, multipleRandomWinnersConfig, ticketDecimals]
  )

  // process events
  if (tx) {
    try {
      let prizePoolCreatedFilter

      switch (prizePoolType) {
        case PRIZE_POOL_TYPES.compound: {
          prizePoolCreatedFilter = prizePoolBuilderContract.filters.CompoundPrizePoolWithMultipleWinnersCreated()
          break
        }
        case PRIZE_POOL_TYPES.stake: {
          prizePoolCreatedFilter = prizePoolBuilderContract.filters.StakePrizePoolWithMultipleWinnersCreated()
          break
        }
        case PRIZE_POOL_TYPES.genericYield: {
          prizePoolCreatedFilter = prizePoolBuilderContract.filters.YieldSourcePrizePoolWithMultipleWinnersCreated()
          break
        }
      }

      const topic = prizePoolCreatedFilter.topics[0]

      const prizePoolCreatedEventLog = tx.logs.find((log) => log.topics.includes(topic))

      const prizePoolCreatedRawLog = prizePoolBuilderContract.interface.parseLog(
        prizePoolCreatedEventLog
      )

      const prizePool = prizePoolCreatedRawLog.args.prizePool
      const prizeStrategy = prizePoolCreatedRawLog.args.prizeStrategy

      setResultingContractAddresses({
        prizePool,
        prizeStrategy
      })
    } catch (e) {
      setTx((tx) => ({
        ...tx,
        inWallet: false,
        sent: true,
        completed: true,
        error: true
      }))

      poolToast.error(
        `Error processing transaction. See JS Console or Etherscan for transaction details`
      )

      console.error(e.message)
      throw e
    }
  }
}

/**
 * Returns {
 *   maxExitFeeMantissa
 *     and one of:
 *   cToken - a compatible ctoken / compound contract address
 *   yieldSource - custom yield source address
 *   token - Staked token address
 * }
 *
 * @param params - Passthrough of params from sendPrizePoolBuilderTx
 */
const getPrizePoolConfig = (params) => {
  const { prizePool, cTokenAddress, stakedTokenAddress, yieldSourceAddress } = params

  const maxExitFeePercentage = MAX_EXIT_FEE_PERCENTAGE
  const maxExitFeeMantissa = percentageToFraction(maxExitFeePercentage).toString()

  const prizePoolConfig = {
    maxExitFeeMantissa: toWei(maxExitFeeMantissa)
  }

  switch (prizePool.type) {
    case PRIZE_POOL_TYPES.compound: {
      prizePoolConfig.cToken = cTokenAddress
      break
    }
    case PRIZE_POOL_TYPES.stake: {
      prizePoolConfig.token = stakedTokenAddress
      break
    }
    case PRIZE_POOL_TYPES.genericYield: {
      prizePoolConfig.yieldSource = yieldSourceAddress
      break
    }
  }

  return prizePoolConfig
}

/**
 * Call proper builder fn based on selected prize pool type
 * @param {*} prizePoolType
 */
const getTxMethod = (prizePoolType) => {
  switch (prizePoolType) {
    case PRIZE_POOL_TYPES.compound: {
      return 'createCompoundMultipleWinners'
    }
    case PRIZE_POOL_TYPES.stake: {
      return 'createStakeMultipleWinners'
    }
    case PRIZE_POOL_TYPES.genericYield: {
      return 'createYieldSourceMultipleWinners'
    }
  }
}

const FORM_FIELD_DEFAULTS = {
  resultingContractAddresses: {},
  depositToken: {},
  prizePool: {},
  rngService: '',
  prizePeriodStartAt: '',
  prizePeriodInDays: '7',
  sponsorshipName: 'PT Sponsorship',
  sponsorshipSymbol: 'S',
  ticketName: 'PT',
  ticketSymbol: 'P',
  numberOfWinners: 1,
  creditMaturationInDays: '14',
  ticketCreditLimitPercentage: '1',
  prizeSplits: [
    {
      target: '',
      percentage: 0,
      token: 0
    },
    {
      target: '',
      percentage: 0,
      token: 0
    }
  ],
  tx: {
    inWallet: false,
    sent: false,
    completed: false
  }
}

/**
 * BuilderUI Component
 */
export const BuilderUI = (props) => {
  const [resultingContractAddresses, setResultingContractAddresses] = useState(
    FORM_FIELD_DEFAULTS.resultingContractAddresses
  )

  // Deposit Token (name, symbol, decimals, address)
  const [depositToken, setDepositToken] = useState(FORM_FIELD_DEFAULTS.depositToken)
  // Prize Pool (PRIZE_POOL_TYPES, (optional - selected prize pool option))
  const [prizePool, setPrizePool] = useState(FORM_FIELD_DEFAULTS.prizePool)

  const [rngService, setRngService] = useState(FORM_FIELD_DEFAULTS.rngService)
  const [prizePeriodStartAt, setPrizePeriodStartAt] = useState(
    FORM_FIELD_DEFAULTS.prizePeriodStartAt
  )
  const [prizePeriodInDays, setPrizePeriodInDays] = useState(FORM_FIELD_DEFAULTS.prizePeriodInDays)
  const [sponsorshipName, setSponsorshipName] = useState(FORM_FIELD_DEFAULTS.sponsorshipName)
  const [sponsorshipSymbol, setSponsorshipSymbol] = useState(FORM_FIELD_DEFAULTS.sponsorshipSymbol)
  const [ticketSymbol, setTicketSymbol] = useState(FORM_FIELD_DEFAULTS.ticketSymbol)
  const [ticketName, setTicketName] = useState(FORM_FIELD_DEFAULTS.ticketName)
  const [numberOfWinners, setNumberOfWinners] = useState(FORM_FIELD_DEFAULTS.numberOfWinners)
  const [creditMaturationInDays, setCreditMaturationInDays] = useState(
    FORM_FIELD_DEFAULTS.creditMaturationInDays
  )
  const [ticketCreditLimitPercentage, setTicketCreditLimitPercentage] = useState(
    FORM_FIELD_DEFAULTS.ticketCreditLimitPercentage
  )
  // Add PrizeSplits State
  // @TODO: Updating a nested objected fails. Splitting into individual state fixes the issue.
  // Debugging for a single state object would be preferable.
  const [prizeSplits, setPrizeSplits] = useState(FORM_FIELD_DEFAULTS.prizeSplits)

  const [prizePool1Target, setPrizePool1Target] = useState(
    FORM_FIELD_DEFAULTS.prizeSplits[0].target
  )
  const [prizePool1Percentage, setPrizePool1Percentage] = useState(
    FORM_FIELD_DEFAULTS.prizeSplits[0].percentage
  )
  const [prizePool1TokenType, setPrizePool1TokenType] = useState(
    FORM_FIELD_DEFAULTS.prizeSplits[0].token
  )
  const [prizePool2Target, setPrizePool2Target] = useState(
    FORM_FIELD_DEFAULTS.prizeSplits[1].target
  )
  const [prizePool2Percentage, setPrizePool2Percentage] = useState(
    FORM_FIELD_DEFAULTS.prizeSplits[1].percentage
  )

  const [prizePool2TokenType, setPrizePool2TokenType] = useState(
    FORM_FIELD_DEFAULTS.prizeSplits[1].token
  )

  const [tx, setTx] = useState(FORM_FIELD_DEFAULTS.tx)

  const sendTx = useSendTransaction()
  const { provider } = useOnboard()

  const { walletChainId } = useWalletNetwork()

  let cTokenAddress, stakedTokenAddress, yieldSourceAddress

  switch (prizePool.type) {
    case PRIZE_POOL_TYPES.compound: {
      cTokenAddress = prizePool?.yieldProtocol?.value
      break
    }
    case PRIZE_POOL_TYPES.stake: {
      stakedTokenAddress = prizePool?.yieldProtocol?.value
      break
    }
    case PRIZE_POOL_TYPES.genericYield: {
      yieldSourceAddress = prizePool?.yieldProtocol?.value
      break
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const prizeSplitsMerged = []

    if (isValidAddress(prizePool1Target) && prizePool1Target != constants.AddressZero) {
      prizeSplitsMerged.push({
        target: prizePool1Target,
        percentage: convertPercentageToSingleDecimalPrecision(prizePool1Percentage),
        token: prizePool1TokenType
      })
    } else if (prizePool1Target && prizePool1Target != constants.AddressZero) {
      const ensResolved = await provider.resolveName(prizePool1Target)
      if (isValidAddress(ensResolved)) {
        prizeSplitsMerged.push({
          target: ensResolved,
          percentage: convertPercentageToSingleDecimalPrecision(prizePool1Percentage),
          token: prizePool1TokenType
        })
      } else {
        poolToast.error(`First Prize Split: Unable to resolve ENS address`)
        return
      }
    }

    if (isValidAddress(prizePool2Target) && prizePool2Target != constants.AddressZero) {
      prizeSplitsMerged.push({
        target: prizePool2Target,
        percentage: convertPercentageToSingleDecimalPrecision(prizePool2Percentage),
        token: prizePool2TokenType
      })
    } else if (prizePool2Target && prizePool2Target != constants.AddressZero) {
      const ensResolved = await provider.resolveName(prizePool2Target)
      if (isValidAddress(ensResolved)) {
        prizeSplitsMerged.push({
          target: ensResolved,
          percentage: convertPercentageToSingleDecimalPrecision(prizePool2Percentage),
          token: prizePool2TokenType
        })
      } else {
        poolToast.error(`Second Prize Split: Unable to resolve ENS address`)
        return
      }
      prizeSplitsMerged.push({
        target: ensResolved,
        percentage: convertPercentageToSingleDecimalPrecision(prizePool2Percentage),
        token: prizePool2TokenType
      })
    }

    const requiredValues = [
      rngService,
      sponsorshipName,
      sponsorshipSymbol,
      ticketName,
      ticketSymbol,
      creditMaturationInDays,
      ticketCreditLimitPercentage,
      numberOfWinners,
      prizeSplitsMerged
    ]

    let ticketDecimals = depositToken?.tokenDecimals || TICKET_DECIMALS

    switch (prizePool.type) {
      case PRIZE_POOL_TYPES.compound: {
        requiredValues.push(cTokenAddress)
        break
      }
      case PRIZE_POOL_TYPES.stake: {
        requiredValues.push(stakedTokenAddress)
        break
      }
      case PRIZE_POOL_TYPES.genericYield: {
        requiredValues.push(yieldSourceAddress)
        break
      }
    }

    if (!requiredValues.every(Boolean)) {
      poolToast.error(`Please fill out all fields`)
      console.error(
        `Missing one or more of rng, sponsorshipName, sponsorshipSymbol, ticketName, ticketSymbol, creditMaturationInDays, ticketCreditLimitPercentage or creditRateMantissa, (and 1 of cTokenAddress, stakedTokenAddress, or yieldSourceAddress) on network ${walletChainId}`
      )
      return
    }

    setTx((tx) => ({
      ...tx,
      inWallet: true
    }))

    const params = {
      prizePool,
      stakedTokenAddress,
      yieldSourceAddress,
      cTokenAddress,
      ticketDecimals,
      rngService,
      prizePeriodStartAt,
      prizePeriodInDays,
      ticketName,
      ticketSymbol,
      sponsorshipName,
      sponsorshipSymbol,
      creditMaturationInDays,
      ticketCreditLimitPercentage,
      numberOfWinners,
      prizeSplitsMerged
    }

    sendPrizePoolBuilderTx(
      sendTx,
      params,
      provider,
      walletChainId,
      setTx,
      setResultingContractAddresses
    )
  }

  const txInFlight = tx.inWallet || tx.sent
  const txCompleted = tx.completed

  const resetState = (e) => {
    if (e) {
      e.preventDefault()
    }

    setPrizePool(FORM_FIELD_DEFAULTS.prizePool)
    setDepositToken(FORM_FIELD_DEFAULTS.depositToken)
    setPrizePeriodInDays(FORM_FIELD_DEFAULTS.prizePeriodInDays)
    setSponsorshipName(FORM_FIELD_DEFAULTS.sponsorshipName)
    setSponsorshipSymbol(FORM_FIELD_DEFAULTS.sponsorshipSymbol)
    setTicketName(FORM_FIELD_DEFAULTS.ticketName)
    setTicketSymbol(FORM_FIELD_DEFAULTS.ticketSymbol)
    setCreditMaturationInDays(FORM_FIELD_DEFAULTS.creditMaturationInDays)
    setTicketCreditLimitPercentage(FORM_FIELD_DEFAULTS.ticketCreditLimitPercentage)
    setRngService(FORM_FIELD_DEFAULTS.rngService)
    setTx(FORM_FIELD_DEFAULTS.tx)
    setResultingContractAddresses(FORM_FIELD_DEFAULTS.resultingContractAddresses)
    setPrizePool1Target(FORM_FIELD_DEFAULTS.prizeSplits[0].target)
    setPrizePool1Percentage(FORM_FIELD_DEFAULTS.prizeSplits[0].percentage)
    setPrizePool1TokenType(FORM_FIELD_DEFAULTS.prizeSplits[0].token)
    setPrizePool2Target(FORM_FIELD_DEFAULTS.prizeSplits[1].target)
    setPrizePool2Percentage(FORM_FIELD_DEFAULTS.prizeSplits[1].percentage)
    setPrizePool2TokenType(FORM_FIELD_DEFAULTS.prizeSplits[1].token)
  }

  useEffect(() => {
    resetState()
  }, [walletChainId])

  return (
    <>
      {typeof resultingContractAddresses.prizePool === 'string' ? (
        <>
          <div className='bg-default -mx-8 sm:-mx-0 sm:mx-auto py-4 px-12 sm:p-10 pb-16 rounded-xl sm:w-full lg:w-3/4 text-base sm:text-lg mb-4'>
            <BuilderResultPanel resultingContractAddresses={resultingContractAddresses} />
          </div>
        </>
      ) : (
        <>
          {txInFlight ? (
            <div className='bg-default -mx-8 sm:-mx-0 sm:mx-auto py-4 px-12 sm:p-10 pb-16 rounded-xl sm:w-full lg:w-3/4 text-base sm:text-lg mb-4'>
              <TxMessage txType='Deploy Prize Pool Contracts' tx={tx} />
            </div>
          ) : (
            <>
              <BuilderForm
                resetState={resetState}
                handleSubmit={handleSubmit}
                vars={{
                  prizePool,
                  depositToken,
                  rngService,
                  prizePeriodStartAt,
                  prizePeriodInDays,
                  sponsorshipName,
                  sponsorshipSymbol,
                  ticketName,
                  ticketSymbol,
                  creditMaturationInDays,
                  ticketCreditLimitPercentage,
                  numberOfWinners,
                  prizeSplits,
                  prizePool1Target,
                  prizePool1Percentage,
                  prizePool1TokenType,
                  prizePool2Target,
                  prizePool2Percentage,
                  prizePool2TokenType
                }}
                stateSetters={{
                  setPrizePool,
                  setDepositToken,
                  setRngService,
                  setPrizePeriodStartAt,
                  setPrizePeriodInDays,
                  setSponsorshipName,
                  setSponsorshipSymbol,
                  setTicketName,
                  setTicketSymbol,
                  setCreditMaturationInDays,
                  setTicketCreditLimitPercentage,
                  setNumberOfWinners,
                  setPrizePool1Target,
                  setPrizePool1Percentage,
                  setPrizePool1TokenType,
                  setPrizePool2Target,
                  setPrizePool2Percentage,
                  setPrizePool2TokenType
                }}
              />
            </>
          )}
        </>
      )}

      {txCompleted && (
        <>
          <div className='sm:-mx-0 sm:mx-auto py-4 px-12 sm:p-10 pb-16 rounded-xl sm:w-full lg:w-3/4 text-base sm:text-lg mb-20'>
            <div className='my-3 text-center'>
              <button
                className='font-bold rounded-full text-green-1 border border-green-1 hover:text-white hover:bg-lightPurple-1000 text-xxs sm:text-base pt-2 pb-2 px-3 sm:px-6 trans'
                onClick={resetState}
              >
                Reset Form
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
