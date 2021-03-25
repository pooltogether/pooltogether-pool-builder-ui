import React, { useContext, useState } from 'react'
import { ethers } from 'ethers'

import CompoundPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/CompoundPrizePool'
import StakePrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/StakePrizePool'
import YieldSourcePrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/YieldSourcePrizePool'
import PoolWithMultipleWinnersBuilderAbi from '@pooltogether/pooltogether-contracts/abis/PoolWithMultipleWinnersBuilder'
import MultipleWinnersBuilderAbi from '@pooltogether/pooltogether-contracts/abis/MultipleWinnersBuilder'

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
import { poolToast } from 'lib/utils/poolToast'
import { daysToSeconds, percentageToFraction } from 'lib/utils/format'
import { calculateMaxTimelockDuration } from 'lib/utils/calculateMaxTimelockDuration'

const now = () => Math.floor(new Date().getTime() / 1000)
const toWei = ethers.utils.parseEther

const sendPrizeStrategyTx = async (
  params,
  walletContext,
  chainId,
  setTx,
  setResultingContractAddresses
) => {
  const usersAddress = walletContext.state.address
  const provider = walletContext.state.provider
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
    prizePoolType
  } = params

  const [prizePoolConfig, prizePoolAbi] = getPrizePoolDetails(params, signer, chainId)

  const prizePoolBuilderAddress = CONTRACT_ADDRESSES[chainId].POOL_WITH_MULTIPLE_WINNERS_BUILDER
  const prizePoolBuilderContract = new ethers.Contract(
    prizePoolBuilderAddress,
    PoolWithMultipleWinnersBuilderAbi,
    signer
  )

  const multipleWinnersBuilderInterface = new ethers.utils.Interface(MultipleWinnersBuilderAbi)

  // Determine appropriate Credit Rate based on Credit Limit / Credit Maturation (in seconds)
  const prizePeriodSeconds = daysToSeconds(prizePeriodInDays)
  const ticketCreditLimitMantissa = percentageToFraction(ticketCreditLimitPercentage).toString()
  const ticketCreditMaturationInSeconds = daysToSeconds(creditMaturationInDays)
  const ticketCreditRateMantissa = ticketCreditMaturationInSeconds
    ? ethers.utils.parseEther(ticketCreditLimitMantissa).div(ticketCreditMaturationInSeconds)
    : ethers.BigNumber.from(0)

  const prizePeriodStartInt = parseInt(prizePeriodStartAt, 10)
  const prizePeriodStartTimestamp = (prizePeriodStartInt === 0
    ? now()
    : prizePeriodStartInt
  ).toString()

  const rngServiceAddress = CONTRACT_ADDRESSES[chainId].RNG_SERVICE[rngService]

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
    const receipt = await provider.getTransactionReceipt(newTx.hash)

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
 *  prizePoolAbi - ABI of the selected Prize Pool
 * ]
 *
 * @param params - Passthrough of params from sendPrizeStrategyTx
 * @param signer
 * @param chainId
 */
const getPrizePoolDetails = (params, signer, chainId) => {
  const {
    prizePoolType,
    cTokenAddress,
    stakedTokenAddress,
    yieldSourceAddress,
    prizePeriodInDays,
    ticketCreditLimitPercentage
  } = params

  const maxExitFeePercentage = MAX_EXIT_FEE_PERCENTAGE
  const maxTimelockDurationDays = calculateMaxTimelockDuration(prizePeriodInDays)
  const maxExitFeeMantissa = percentageToFraction(maxExitFeePercentage).toString()
  const maxTimelockDuration = daysToSeconds(maxTimelockDurationDays)

  switch (prizePoolType) {
    case PRIZE_POOL_TYPE.compound: {
      return [
        {
          cToken: cTokenAddress,
          maxExitFeeMantissa: toWei(maxExitFeeMantissa),
          maxTimelockDuration
        },
        CompoundPrizePoolAbi
      ]
    }
    case PRIZE_POOL_TYPE.stake: {
      return [
        {
          token: stakedTokenAddress,
          maxExitFeeMantissa: toWei(maxExitFeeMantissa),
          maxTimelockDuration
        },
        StakePrizePoolAbi
      ]
    }
    case PRIZE_POOL_TYPE.yield: {
      return [
        {
          yieldSource: yieldSourceAddress,
          maxExitFeeMantissa: toWei(maxExitFeeMantissa),
          maxTimelockDuration
        },
        YieldSourcePrizePoolAbi
      ]
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
  const [prizePoolType, setPrizePoolType] = useState('')

  // Prize Pool Types
  // Compound
  const [cToken, setCToken] = useState('')
  // Staking
  const [stakedTokenData, setStakedTokenData] = useState()
  const [stakedTokenAddress, setStakedTokenAddress] = useState('')
  // Yield Source
  const [yieldSourceAddress, setYieldSourceAddress] = useState('')
  const [yieldSourceData, setYieldSourceData] = useState()

  const [rngService, setRngService] = useState('')
  const [prizePeriodStartAt, setPrizePeriodStartAt] = useState('0')
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

  const digChainIdFromWalletState = () => {
    const onboard = walletContext._onboard

    let chainId = 1
    if (onboard) {
      chainId = onboard.getState().appNetworkId
    }

    return chainId
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const chainId = digChainIdFromWalletState()

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

    const cTokenAddress = CONTRACT_ADDRESSES[chainId]?.COMPOUND?.[cToken]
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
      case PRIZE_POOL_TYPE.yield: {
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
        `Missing one or more of rng, sponsorshipName, sponsorshipSymbol, ticketName, ticketSymbol, stakedTokenAddress, creditMaturationInDays, ticketCreditLimitPercentage or creditRateMantissa for token ${cToken} on network ${chainId}!`
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

    sendPrizeStrategyTx(params, walletContext, chainId, setTx, setResultingContractAddresses)
  }

  const txInFlight = tx.inWallet || tx.sent
  const txCompleted = tx.completed

  const resetState = (e) => {
    e.preventDefault()
    setPrizePoolType('')
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

  return (
    <>
      {typeof resultingContractAddresses.prizePool === 'string' ? (
        <>
          <div className='bg-default -mx-8 sm:-mx-0 sm:mx-auto py-4 px-12 sm:p-10 pb-16 rounded-xl sm:w-full lg:w-3/4 text-base sm:text-lg mb-20'>
            <BuilderResultPanel resultingContractAddresses={resultingContractAddresses} />
          </div>
        </>
      ) : (
        <>
          {txInFlight ? (
            <>
              <div className='bg-default -mx-8 sm:-mx-0 sm:mx-auto py-4 px-12 sm:p-10 pb-16 rounded-xl sm:w-full lg:w-3/4 text-base sm:text-lg mb-20'>
                <TxMessage txType='Deploy Prize Pool Contracts' tx={tx} />
              </div>
            </>
          ) : (
            <>
              <BuilderForm
                handleSubmit={handleSubmit}
                vars={{
                  prizePoolType,
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
          <div className='bg-default -mx-8 sm:-mx-0 sm:mx-auto py-4 px-12 sm:p-10 pb-16 rounded-xl sm:w-full lg:w-3/4 text-base sm:text-lg mb-20'>
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
