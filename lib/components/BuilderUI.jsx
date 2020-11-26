import React, { useContext, useState } from 'react'
import { ethers } from 'ethers'

import CompoundPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/CompoundPrizePool'
import CompoundPrizePoolBuilderAbi from '@pooltogether/pooltogether-contracts/abis/CompoundPrizePoolBuilder'
import StakePrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/StakePrizePool'
import StakePrizePoolBuilderAbi from '@pooltogether/pooltogether-contracts/abis/StakePrizePoolBuilder'
import SingleRandomWinnerBuilderAbi from '@pooltogether/pooltogether-contracts/abis/SingleRandomWinnerBuilder'

import {
  CONTRACT_ADDRESSES,
  PRIZE_POOL_TYPE,
  TICKET_DECIMALS
} from 'lib/constants'
import { BuilderForm } from 'lib/components/BuilderForm'
import { BuilderResultPanel } from 'lib/components/BuilderResultPanel'
import { TxMessage } from 'lib/components/TxMessage'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { poolToast } from 'lib/utils/poolToast'
import { daysToSeconds, percentageToFraction } from 'lib/utils/format'

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
    sponsorshipName,
    sponsorshipSymbol,
    creditMaturationInDays,
    ticketCreditLimitPercentage,
    externalERC20Awards
  } = params

  const [
    prizePoolBuilderContract,
    prizePoolConfig,
    prizePoolAbi
  ] = getPrizePoolDetails(params, signer, chainId)

  const singleRandomWinnerBuilderAddress =
    CONTRACT_ADDRESSES[chainId]['SINGLE_RANDOM_WINNER_BUILDER']
  const singleRandomWinnerBuilderContract = new ethers.Contract(
    singleRandomWinnerBuilderAddress,
    SingleRandomWinnerBuilderAbi,
    signer
  )

  // Determine appropriate Credit Rate based on Credit Limit / Credit Maturation (in seconds)
  const prizePeriodInSeconds = daysToSeconds(prizePeriodInDays)
  const ticketCreditLimitMantissa = percentageToFraction(ticketCreditLimitPercentage).toString()
  const ticketCreditMaturationInSeconds = daysToSeconds(creditMaturationInDays)
  const ticketCreditRateMantissa = ethers.utils      
    .parseEther(ticketCreditLimitMantissa)
    .div(ticketCreditMaturationInSeconds)

  const prizePeriodStartInt = parseInt(prizePeriodStartAt, 10)
  const prizePeriodStartTimestamp = (prizePeriodStartInt === 0
    ? now()
    : prizePeriodStartInt
  ).toString()

  const rngServiceAddress = CONTRACT_ADDRESSES[chainId].RNG_SERVICE[rngService]

  const singleRandomWinnerConfig = {
    rngService: rngServiceAddress,
    prizePeriodStart: prizePeriodStartTimestamp,
    prizePeriodSeconds: prizePeriodInSeconds,
    ticketName,
    ticketSymbol,
    sponsorshipName,
    sponsorshipSymbol,
    ticketCreditLimitMantissa: toWei(ticketCreditLimitMantissa),
    ticketCreditRateMantissa,
    externalERC20Awards
  }

  try {
    const newTx = await prizePoolBuilderContract.createSingleRandomWinner(
      prizePoolConfig,
      singleRandomWinnerConfig,
      TICKET_DECIMALS,
      {
        gasLimit: 3000000
      }
    )

    setTx(tx => ({
      ...tx,
      hash: newTx.hash,
      sent: true
    }))

    await newTx.wait()
    const receipt = await provider.getTransactionReceipt(newTx.hash)
    const txBlockNumber = receipt.blockNumber

    setTx(tx => ({
      ...tx,
      completed: true
    }))

    poolToast.success('Transaction complete!')

    // events
    const prizePoolCreatedFilter = prizePoolBuilderContract.filters.PrizePoolCreated(
      usersAddress
    )
    const prizePoolCreatedRawLogs = await provider.getLogs({
      ...prizePoolCreatedFilter,
      fromBlock: txBlockNumber,
      toBlock: txBlockNumber
    })
    const prizePoolCreatedEventLog = prizePoolBuilderContract.interface.parseLog(
      prizePoolCreatedRawLogs[0]
    )
    const prizePool = prizePoolCreatedEventLog.values.prizePool

    const prizePoolContract = new ethers.Contract(
      prizePool,
      prizePoolAbi,
      signer
    )
    const prizeStrategySetFilter = prizePoolContract.filters.PrizeStrategySet(
      null
    )
    const prizeStrategySetRawLogs = await provider.getLogs({
      ...prizeStrategySetFilter,
      fromBlock: txBlockNumber,
      toBlock: txBlockNumber
    })

    const prizeStrategySetEventLogs = prizePoolContract.interface.parseLog(
      prizeStrategySetRawLogs[0]
    )
    const prizeStrategy = prizeStrategySetEventLogs.values.prizeStrategy

    const singleRandomWinnerCreatedFilter = singleRandomWinnerBuilderContract.filters.SingleRandomWinnerCreated(
      prizeStrategy
    )
    const singleRandomWinnerCreatedRawLogs = await provider.getLogs({
      ...singleRandomWinnerCreatedFilter,
      fromBlock: txBlockNumber,
      toBlock: txBlockNumber
    })
    const singleRandomWinnerCreatedEventLog = singleRandomWinnerBuilderContract.interface.parseLog(
      singleRandomWinnerCreatedRawLogs[0]
    )
    const ticket = singleRandomWinnerCreatedEventLog.values.ticket
    const sponsorship = singleRandomWinnerCreatedEventLog.values.sponsorship

    setResultingContractAddresses({
      prizePool,
      prizeStrategy,
      ticket,
      sponsorship
    })
  } catch (e) {
    setTx(tx => ({
      ...tx,
      hash: '',
      inWallet: true,
      sent: true,
      completed: true,
      error: true
    }))

    poolToast.error(`Error with transaction. See JS Console`)

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
    maxExitFeePercentage,
    maxTimelockDurationDays
  } = params

  const maxExitFeeMantissa = percentageToFraction(maxExitFeePercentage).toString()
  const maxTimelockDuration = daysToSeconds(maxTimelockDurationDays)

  switch (prizePoolType) {
    case PRIZE_POOL_TYPE.compound: {
      const compoundPrizePoolBuilderAddress =
        CONTRACT_ADDRESSES[chainId]['COMPOUND_PRIZE_POOL_BUILDER']

      return [
        new ethers.Contract(
          compoundPrizePoolBuilderAddress,
          CompoundPrizePoolBuilderAbi,
          signer
        ),
        {
          cToken: cTokenAddress,
          maxExitFeeMantissa: toWei(maxExitFeeMantissa),
          maxTimelockDuration
        },
        CompoundPrizePoolAbi
      ]
    }
    case PRIZE_POOL_TYPE.stake: {
      const stakePrizePoolBuilderAddress =
        CONTRACT_ADDRESSES[chainId]['STAKE_PRIZE_POOL_BUILDER']

      return [
        new ethers.Contract(
          stakePrizePoolBuilderAddress,
          StakePrizePoolBuilderAbi,
          signer
        ),
        {
          token: stakedTokenAddress,
          maxExitFeeMantissa: toWei(maxExitFeeMantissa),
          maxTimelockDuration
        },
        StakePrizePoolAbi
      ]
    }
  }
}

/**
 * BuilderUI Component
 */
export const BuilderUI = props => {
  const [resultingContractAddresses, setResultingContractAddresses] = useState({})
  const [prizePoolType, setPrizePoolType] = useState(PRIZE_POOL_TYPE.compound)
  const [cToken, setCToken] = useState('cDai')
  const [stakedTokenAddress, setStakedTokenAddress] = useState('')
  const [rngService, setRngService] = useState('blockhash')
  const [prizePeriodStartAt, setPrizePeriodStartAt] = useState('0')
  const [prizePeriodInDays, setPrizePeriodInDays] = useState('7')
  const [sponsorshipName, setSponsorshipName] = useState('')
  const [sponsorshipSymbol, setSponsorshipSymbol] = useState('')
  const [ticketName, setTicketName] = useState('')
  const [ticketSymbol, setTicketSymbol] = useState('')
  const [creditMaturationInDays, setCreditMaturationInDays] = useState('7')
  const [maxExitFeePercentage, setMaxExitFeePercentage] = useState('40')
  const [maxTimelockDurationDays, setMaxTimelockDurationDays] = useState('28')
  const [ticketCreditLimitPercentage, setTicketCreditLimitPercentage] = useState('10')
  const [externalERC20Awards, setExternalERC20Awards] = useState([])
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

  const handleSubmit = async e => {
    e.preventDefault()

    const chainId = digChainIdFromWalletState()

    const requiredValues = [
      rngService,
      sponsorshipName,
      sponsorshipSymbol,
      ticketName,
      ticketSymbol,
      maxExitFeePercentage,
      creditMaturationInDays,
      maxTimelockDurationDays,
      ticketCreditLimitPercentage
    ]

    const cTokenAddress = CONTRACT_ADDRESSES[chainId][cToken]

    switch (prizePoolType) {
      case PRIZE_POOL_TYPE.compound: {
        requiredValues.push(cTokenAddress)
        break
      }
      case PRIZE_POOL_TYPE.stake: {
        requiredValues.push(stakedTokenAddress)
        break
      }
    }

    if (!requiredValues.every(Boolean)) {
      poolToast.error(`Please fill out all fields`)
      console.error(
        `Missing one or more of sponsorshipName, sponsorshipSymbol, ticketName, ticketSymbol, stakedTokenAddress, maxExitFeePercentage, maxTimelockDurationDays, creditMaturationInDays, ticketCreditLimitPercentage or creditRateMantissa for token ${cToken} on network ${chainId}!`
      )
      return
    }

    setTx(tx => ({
      ...tx,
      inWallet: true
    }))

    const params = {
      prizePoolType,
      stakedTokenAddress,
      cTokenAddress,
      rngService,
      prizePeriodStartAt,
      prizePeriodInDays,
      ticketName,
      ticketSymbol,
      sponsorshipName,
      sponsorshipSymbol,
      creditMaturationInDays,
      maxExitFeePercentage,
      maxTimelockDurationDays,
      ticketCreditLimitPercentage,
      externalERC20Awards
    }

    sendPrizeStrategyTx(
      params,
      walletContext,
      chainId,
      setTx,
      setResultingContractAddresses
    )
  }

  const txInFlight = tx.inWallet || tx.sent
  const txCompleted = tx.completed

  const resetState = e => {
    e.preventDefault()
    setPrizePoolType(PRIZE_POOL_TYPE.compound)
    setTx({})
    setResultingContractAddresses({})
  }

  return (
    <>
      
        {typeof resultingContractAddresses.prizePool === 'string' ? (
          <>
          <div className='bg-default -mx-8 sm:-mx-0 sm:mx-auto py-4 px-12 sm:p-10 pb-16 rounded-xl sm:w-full lg:w-3/4 text-base sm:text-lg mb-20'>
            <BuilderResultPanel
              resultingContractAddresses={resultingContractAddresses}
            />

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
                    stakedTokenAddress,
                    rngService,
                    prizePeriodStartAt,
                    prizePeriodInDays,
                    sponsorshipName,
                    sponsorshipSymbol,
                    ticketName,
                    ticketSymbol,
                    creditMaturationInDays,
                    maxExitFeePercentage,
                    maxTimelockDurationDays,
                    ticketCreditLimitPercentage,
                    externalERC20Awards
                  }}
                  stateSetters={{
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
                    setCreditMaturationInDays,
                    setMaxExitFeePercentage,
                    setMaxTimelockDurationDays,
                    setTicketCreditLimitPercentage,
                    setExternalERC20Awards
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
                className='font-bold rounded-full text-green border-2 sm:border-4 border-green hover:text-white hover:bg-lightPurple-1000 text-xxs sm:text-base pt-2 pb-2 px-3 sm:px-6 trans'
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
