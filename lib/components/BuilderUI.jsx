import React, { useContext, useState } from 'react'
import { ethers } from 'ethers'

import AavePrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/AavePrizePool'
import AavePrizePoolBuilderAbi from '@pooltogether/pooltogether-contracts/abis/AavePrizePoolBuilder'
import CompoundPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/CompoundPrizePool'
import CompoundPrizePoolBuilderAbi from '@pooltogether/pooltogether-contracts/abis/CompoundPrizePoolBuilder'
import SingleRandomWinnerBuilderAbi from '@pooltogether/pooltogether-contracts/abis/SingleRandomWinnerBuilder'

import {
  CONTRACT_ADDRESSES,
  TICKET_DECIMALS
} from 'lib/constants'
import { BuilderForm } from 'lib/components/BuilderForm'
import { BuilderResultPanel } from 'lib/components/BuilderResultPanel'
import { TxMessage } from 'lib/components/TxMessage'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { poolToast } from 'lib/utils/poolToast'

const now = () => Math.floor((new Date()).getTime() / 1000)
const toWei = ethers.utils.parseEther

const sendPrizeStrategyTx = async (params, walletContext, chainId, setTx, setResultingContractAddresses) => {
  const usersAddress = walletContext.state.address
  const provider = walletContext.state.provider
  const signer = provider.getSigner()

  const {
    aTokenAddress,
    cTokenAddress,
    rngService,
    prizePeriodStartAt,
    prizePeriodSeconds,
    ticketName,
    ticketSymbol,
    sponsorshipName,
    sponsorshipSymbol,
    maxExitFeeMantissa,
    maxTimelockDuration,
    ticketCreditLimitMantissa,
    externalERC20Awards,
  } = params

  const aavePrizePoolBuilderAddress = CONTRACT_ADDRESSES[chainId]['AAVE_PRIZE_POOL_BUILDER']
  const aavePrizePoolBuilderContract = new ethers.Contract(
    aavePrizePoolBuilderAddress,
    AavePrizePoolBuilderAbi,
    signer
  )

  const compoundPrizePoolBuilderAddress = CONTRACT_ADDRESSES[chainId]['COMPOUND_PRIZE_POOL_BUILDER']
  const compoundPrizePoolBuilderContract = new ethers.Contract(
    compoundPrizePoolBuilderAddress,
    CompoundPrizePoolBuilderAbi,
    signer
  )

  const singleRandomWinnerBuilderAddress = CONTRACT_ADDRESSES[chainId]['SINGLE_RANDOM_WINNER_BUILDER']
  const singleRandomWinnerBuilderContract = new ethers.Contract(
    singleRandomWinnerBuilderAddress,
    SingleRandomWinnerBuilderAbi,
    signer
  )

  // Determine appropriate Credit Rate based on Exit Fee / Prize Period
  const ticketCreditRateMantissa = ethers.utils.parseEther(ticketCreditLimitMantissa).div(prizePeriodSeconds)

  const prizePeriodStartInt = parseInt(prizePeriodStartAt, 10)
  const prizePeriodStartTimestamp = ((prizePeriodStartInt === 0) ? now() : prizePeriodStartInt).toString()

  const rngServiceAddress = CONTRACT_ADDRESSES[chainId].RNG_SERVICE[rngService]

  let prizePoolAbi;
  let prizePoolBuilderContract;
  let prizePoolConfig = {
    maxExitFeeMantissa: toWei(maxExitFeeMantissa),
    maxTimelockDuration,
  }

  if (aTokenAddress !== undefined) {
    prizePoolAbi = AavePrizePoolAbi
    prizePoolBuilderContract = aavePrizePoolBuilderContract
    prizePoolConfig = { ...prizePoolConfig, aToken: aTokenAddress }
  } else if (cTokenAddress !== undefined) {
    prizePoolAbi = CompoundPrizePoolAbi
    prizePoolBuilderContract = compoundPrizePoolBuilderContract
    prizePoolConfig = { ...prizePoolConfig, cToken: cTokenAddress }
  }

  const singleRandomWinnerConfig = {
    rngService: rngServiceAddress,
    prizePeriodStart: prizePeriodStartTimestamp,
    prizePeriodSeconds,
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
      sent: true,
    }))

    await newTx.wait()
    const receipt = await provider.getTransactionReceipt(newTx.hash)
    const txBlockNumber = receipt.blockNumber

    setTx(tx => ({
      ...tx,
      completed: true,
    }))

    poolToast.success('Transaction complete!')

    // events
    const prizePoolCreatedFilter = prizePoolBuilderContract.filters.PrizePoolCreated(
      usersAddress,
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
    const prizePoolContract = new ethers.Contract(prizePool, prizePoolAbi, signer)
    const prizeStrategySetFilter = prizePoolContract.filters.PrizeStrategySet(null)

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
      prizeStrategy,
    )
    const singleRandomWinnerCreatedRawLogs = await provider.getLogs({
      ...singleRandomWinnerCreatedFilter,
      fromBlock: txBlockNumber,
      toBlock: txBlockNumber,
    })
    const singleRandomWinnerCreatedEventLog = singleRandomWinnerBuilderContract.interface.parseLog(
      singleRandomWinnerCreatedRawLogs[0],
    )
    const ticket = singleRandomWinnerCreatedEventLog.values.ticket
    const sponsorship = singleRandomWinnerCreatedEventLog.values.sponsorship

    setResultingContractAddresses({
      prizePool,
      prizeStrategy,
      ticket,
      sponsorship,
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

export const BuilderUI = () => {
  const [resultingContractAddresses, setResultingContractAddresses] = useState({})
  const [aToken, setAToken] = useState('aDai')
  const [cToken, setCToken] = useState('cDai')
  const [yieldService, setYieldService] = useState('aave')
  const [rngService, setRngService] = useState('blockhash')
  const [prizePeriodStartAt, setPrizePeriodStartAt] = useState('0')
  const [prizePeriodSeconds, setPrizePeriodSeconds] = useState('3600')
  const [sponsorshipName, setSponsorshipName] = useState('')
  const [sponsorshipSymbol, setSponsorshipSymbol] = useState('')
  const [ticketName, setTicketName] = useState('')
  const [ticketSymbol, setTicketSymbol] = useState('')
  const [maxExitFeeMantissa, setMaxExitFeeMantissa] = useState('0.5')
  const [maxTimelockDuration, setMaxTimelockDuration] = useState('3600')
  const [ticketCreditLimitMantissa, setTicketCreditLimitMantissa] = useState('0.1')
  const [externalERC20Awards, setExternalERC20Awards] = useState([])
  const [tx, setTx] = useState({
    inWallet: false,
    sent: false,
    completed: false,
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

    const aTokenAddress = CONTRACT_ADDRESSES[chainId][aToken]
    const cTokenAddress = CONTRACT_ADDRESSES[chainId][cToken]

    const requiredValues = [
      rngService,
      sponsorshipName,
      sponsorshipSymbol,
      ticketName,
      ticketSymbol,
      maxExitFeeMantissa,
      maxTimelockDuration,
      ticketCreditLimitMantissa,
    ]

    if (yieldService === 'aave') {
      requiredValues.push(aTokenAddress)
    } else if (yieldService === 'compound') {
      requiredValues.push(cTokenAddress)
    }

    if (!requiredValues.every(Boolean)) {
      poolToast.error(`Please fill out all fields`)
      console.error(
        `Missing one or more of sponsorshipName, sponsorshipSymbol, ticketName, ticketSymbol, maxExitFeeMantissa, maxTimelockDuration, ticketCreditLimitMantissa or creditRateMantissa for token ${cToken} on network ${chainId}!`
      )
      return
    }

    setTx(tx => ({
      ...tx,
      inWallet: true
    }))

    let params = {
      rngService,
      prizePeriodStartAt,
      prizePeriodSeconds,
      ticketName,
      ticketSymbol,
      sponsorshipName,
      sponsorshipSymbol,
      maxExitFeeMantissa,
      maxTimelockDuration,
      ticketCreditLimitMantissa,
      externalERC20Awards,
    }

    if (yieldService === 'aave') {
      params = { ...params, aTokenAddress }
    } else if (yieldService === 'compound') {
      params = { ...params, cTokenAddress }
    }

    sendPrizeStrategyTx(params, walletContext, chainId, setTx, setResultingContractAddresses)
  }

  const txInFlight = tx.inWallet || tx.sent
  const txCompleted = tx.completed

  const resetState = (e) => {
    e.preventDefault()
    setTx({})
    setResultingContractAddresses({})
  }

  return <>
    <div
      className='bg-default -mx-8 sm:-mx-0 sm:mx-auto py-4 px-12 sm:p-10 pb-16 rounded-xl sm:w-full lg:w-3/4 text-base sm:text-lg mb-20'
    >
      {(typeof resultingContractAddresses.prizePool === 'string') ? <>
        <BuilderResultPanel
          resultingContractAddresses={resultingContractAddresses}
        />
      </> : <>
        {txInFlight ? <>
          <TxMessage
            txType='Deploy Prize Pool Contracts'
            tx={tx}
          />
        </> : <>
          <BuilderForm
            handleSubmit={handleSubmit}
            vars={{
              aToken,
              cToken,
              yieldService,
              rngService,
              prizePeriodStartAt,
              prizePeriodSeconds,
              sponsorshipName,
              sponsorshipSymbol,
              ticketName,
              ticketSymbol,
              maxExitFeeMantissa,
              maxTimelockDuration,
              ticketCreditLimitMantissa,
              externalERC20Awards,
            }}
            stateSetters={{
              setAToken,
              setCToken,
              setYieldService,
              setRngService,
              setPrizePeriodStartAt,
              setPrizePeriodSeconds,
              setSponsorshipName,
              setSponsorshipSymbol,
              setTicketName,
              setTicketSymbol,
              setMaxExitFeeMantissa,
              setMaxTimelockDuration,
              setTicketCreditLimitMantissa,
              setExternalERC20Awards,
            }}
          />
        </>}
      </>}

      {txCompleted && <>
        <div className='my-3 text-center'>
          <button
            className='font-bold rounded-full text-green border-2 sm:border-4 border-green hover:text-white hover:bg-lightPurple-1000 text-xxs sm:text-base pt-2 pb-2 px-3 sm:px-6 trans'
            onClick={resetState}
          >
            Reset Form
          </button>
        </div>
      </>}

    </div>

  </>
}
