import React, { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'

import PoolWithMultipleWinnersBuilderAbi from '@pooltogether/pooltogether-contracts/abis/PoolWithMultipleWinnersBuilder'

import {
  CONTRACT_ADDRESSES,
  CTOKEN_UNDERLYING_TOKEN_DECIMALS,
  MAX_EXIT_FEE_PERCENTAGE,
  PRIZE_POOL_TYPE,
  TICKET_DECIMALS
} from 'lib/constants'
import { BuilderForm } from 'lib/components/BuilderForm'
import { BuilderResultPanel } from 'lib/components/BuilderResultPanel'
import { TxMessage } from 'lib/components/TxMessage'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { useWalletNetwork } from 'lib/hooks/useWalletNetwork'
import { poolToast } from 'lib/utils/poolToast'
import { daysToSeconds, percentageToFraction } from 'lib/utils/format'
import { calculateMaxTimelockDuration } from 'lib/utils/calculateMaxTimelockDuration'

const now = () => Math.floor(new Date().getTime() / 1000)
const toWei = ethers.utils.parseEther

const sendPrizeStrategyTx = async (
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
    prizePoolType,
    depositToken
  } = params

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
    splitExternalErc20Awards: prizePoolType === PRIZE_POOL_TYPE.stake ? true : false,
    numberOfWinners
  }

  try {
    const newTx = await createPools(
      prizePoolType,
      prizePoolBuilderContract,
      prizePoolConfig,
      multipleRandomWinnersConfig,
      ticketDecimals
    )

    setTx((tx) => ({
      ...tx,
      hash: newTx.hash,
      sent: true
    }))

    const tx = await newTx.wait()

    setTx((tx) => ({
      ...tx,
      completed: true
    }))

    poolToast.success('Transaction complete!')

    // events
    let prizePoolCreatedFilter

    switch (prizePoolType) {
      case PRIZE_POOL_TYPE.compound: {
        prizePoolCreatedFilter = prizePoolBuilderContract.filters.CompoundPrizePoolWithMultipleWinnersCreated()
        break
      }
      case PRIZE_POOL_TYPE.stake: {
        prizePoolCreatedFilter = prizePoolBuilderContract.filters.StakePrizePoolWithMultipleWinnersCreated()
        break
      }
      case PRIZE_POOL_TYPE.yield: {
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
  }
}

/**
 * Returns [
 *  prizePoolBuilderContract - instances of ethers Contract
 *  cToken - address of the cToken
 * ]
 *
 * @param params - Passthrough of params from sendPrizeStrategyTx
 */
const getPrizePoolConfig = (params) => {
  const {
    prizePoolType,
    cTokenAddress,
    stakedTokenAddress,
    yieldSourceAddress,
    prizePeriodInDays
  } = params

  const maxExitFeePercentage = MAX_EXIT_FEE_PERCENTAGE
  const maxTimelockDurationDays = calculateMaxTimelockDuration(prizePeriodInDays)
  const maxExitFeeMantissa = percentageToFraction(maxExitFeePercentage).toString()
  const maxTimelockDuration = daysToSeconds(maxTimelockDurationDays)

  switch (prizePoolType) {
    case PRIZE_POOL_TYPE.compound: {
      return {
        cToken: cTokenAddress,
        maxExitFeeMantissa: toWei(maxExitFeeMantissa),
        maxTimelockDuration
      }
    }
    case PRIZE_POOL_TYPE.stake: {
      return {
        token: stakedTokenAddress,
        maxExitFeeMantissa: toWei(maxExitFeeMantissa),
        maxTimelockDuration
      }
    }
    case PRIZE_POOL_TYPE.yield: {
      return {
        yieldSource: yieldSourceAddress,
        maxExitFeeMantissa: toWei(maxExitFeeMantissa),
        maxTimelockDuration
      }
    }
  }
}

/**
 * Call proper builder fn based on selected prize pool type
 * @param {*} prizePoolType
 * @param {*} builderContract
 * @param {*} prizePoolConfig
 * @param {*} multipleRandomWinnersConfig
 */
const createPools = async (
  prizePoolType,
  builderContract,
  prizePoolConfig,
  multipleRandomWinnersConfig,
  ticketDecimals
) => {
  const gasLimit = 1500000

  switch (prizePoolType) {
    case PRIZE_POOL_TYPE.compound: {
      return await builderContract.createCompoundMultipleWinners(
        prizePoolConfig,
        multipleRandomWinnersConfig,
        ticketDecimals,
        { gasLimit }
      )
    }
    case PRIZE_POOL_TYPE.stake: {
      return await builderContract.createStakeMultipleWinners(
        prizePoolConfig,
        multipleRandomWinnersConfig,
        ticketDecimals,
        { gasLimit }
      )
    }
    case PRIZE_POOL_TYPE.yield: {
      return await builderContract.createYieldSourceMultipleWinners(
        prizePoolConfig,
        multipleRandomWinnersConfig,
        ticketDecimals,
        { gasLimit }
      )
    }
  }
}

/**
 * BuilderUI Component
 */
export const BuilderUI = (props) => {
  const [resultingContractAddresses, setResultingContractAddresses] = useState({})

  // Deposit Token input value
  const [depositToken, setDepositToken] = useState({})
  // Prize Pool Types
  const [prizePoolType, setPrizePoolType] = useState('')
  // Compound
  const [cToken, setCToken] = useState('')
  // Staking
  const [stakedTokenData, setStakedTokenData] = useState()
  const [stakedTokenAddress, setStakedTokenAddress] = useState('')
  // Yield Source
  const [yieldSourceAddress, setYieldSourceAddress] = useState('')
  const [yieldSourceData, setYieldSourceData] = useState()

  const [rngService, setRngService] = useState('')
  const [prizePeriodStartAt, setPrizePeriodStartAt] = useState('')
  const [prizePeriodInDays, setPrizePeriodInDays] = useState('7')
  const [sponsorshipName, setSponsorshipName] = useState('PT Sponsorship')
  const [sponsorshipSymbol, setSponsorshipSymbol] = useState('S')
  const [ticketName, setTicketName] = useState('PT')
  const [numberOfWinners, setNumberOfWinners] = useState(1)
  const [ticketSymbol, setTicketSymbol] = useState('P')
  const [creditMaturationInDays, setCreditMaturationInDays] = useState('14')
  const [ticketCreditLimitPercentage, setTicketCreditLimitPercentage] = useState('1')
  const [tx, setTx] = useState({
    inWallet: false,
    sent: false,
    completed: false
  })

  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider
  const { walletChainId } = useWalletNetwork()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const requiredValues = [
      rngService,
      sponsorshipName,
      sponsorshipSymbol,
      ticketName,
      ticketSymbol,
      creditMaturationInDays,
      ticketCreditLimitPercentage,
      numberOfWinners
    ]

    const cTokenAddress = depositToken?.value
    // const cTokenAddress = CONTRACT_ADDRESSES[walletChainId]?.COMPOUND?.[cToken]
    let ticketDecimals = TICKET_DECIMALS

    switch (prizePoolType) {
      case PRIZE_POOL_TYPE.compound: {
        requiredValues.push(cTokenAddress)
        ticketDecimals = CTOKEN_UNDERLYING_TOKEN_DECIMALS[cToken]
        break
      }
      case PRIZE_POOL_TYPE.stake: {
        requiredValues.push(stakedTokenAddress)

        if (!stakedTokenData || !stakedTokenData?.tokenSymbol) {
          poolToast.error(`Invalid Staking Token Address`)
          return
        }

        if (stakedTokenData.tokenDecimals !== undefined) {
          ticketDecimals = stakedTokenData.tokenDecimals
        }

        break
      }
      case PRIZE_POOL_TYPE.customYield: {
        requiredValues.push(yieldSourceAddress)

        if (!yieldSourceData || !yieldSourceData?.tokenAddress) {
          poolToast.error(`Invalid Yield Source Address`)
          return
        }

        if (yieldSourceData.tokenDecimals !== undefined) {
          ticketDecimals = yieldSourceData.tokenDecimals
        }

        break
      }
    }

    if (!requiredValues.every(Boolean)) {
      poolToast.error(`Please fill out all fields`)
      console.error(
        `Missing one or more of rng, sponsorshipName, sponsorshipSymbol, ticketName, ticketSymbol, stakedTokenAddress, creditMaturationInDays, ticketCreditLimitPercentage or creditRateMantissa for token ${cToken} on network ${walletChainId}!`
      )
      return
    }

    setTx((tx) => ({
      ...tx,
      inWallet: true
    }))

    const params = {
      prizePoolType,
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
      numberOfWinners
    }

    sendPrizeStrategyTx(params, provider, walletChainId, setTx, setResultingContractAddresses)
  }

  const txInFlight = tx.inWallet || tx.sent
  const txCompleted = tx.completed

  const resetState = (e) => {
    if (e) {
      e.preventDefault()
    }
    setPrizePoolType('')
    setDepositToken({})
    setCToken('')
    setStakedTokenAddress('')
    setStakedTokenData(undefined)
    setPrizePeriodInDays(7)
    setSponsorshipName('PT Sponsorship')
    setSponsorshipSymbol('S')
    setTicketName('PT')
    setTicketSymbol('P')
    setCreditMaturationInDays('7')
    setTicketCreditLimitPercentage('10')
    setRngService('')
    setTx({})
    setResultingContractAddresses({})
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
            <>
              <div className='bg-default -mx-8 sm:-mx-0 sm:mx-auto py-4 px-12 sm:p-10 pb-16 rounded-xl sm:w-full lg:w-3/4 text-base sm:text-lg mb-4'>
                <TxMessage txType='Deploy Prize Pool Contracts' tx={tx} />
              </div>
            </>
          ) : (
            <>
              <BuilderForm
                handleSubmit={handleSubmit}
                vars={{
                  prizePoolType,
                  depositToken,
                  cToken,
                  stakedTokenData,
                  stakedTokenAddress,
                  yieldSourceData,
                  yieldSourceAddress,
                  rngService,
                  prizePeriodStartAt,
                  prizePeriodInDays,
                  sponsorshipName,
                  sponsorshipSymbol,
                  ticketName,
                  ticketSymbol,
                  creditMaturationInDays,
                  ticketCreditLimitPercentage,
                  numberOfWinners
                }}
                stateSetters={{
                  setPrizePoolType,
                  setDepositToken,
                  setCToken,
                  setStakedTokenData,
                  setStakedTokenAddress,
                  setYieldSourceData,
                  setYieldSourceAddress,
                  setRngService,
                  setPrizePeriodStartAt,
                  setPrizePeriodInDays,
                  setSponsorshipName,
                  setSponsorshipSymbol,
                  setTicketName,
                  setTicketSymbol,
                  setCreditMaturationInDays,
                  setTicketCreditLimitPercentage,
                  setNumberOfWinners
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
