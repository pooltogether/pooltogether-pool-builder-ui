import React, { useContext, useState } from 'react'
import { ethers } from 'ethers'

import CompoundPrizePoolBuilderAbi from '@pooltogether/pooltogether-contracts/abis/CompoundPrizePoolBuilder'

import { CONTRACT_ADDRESSES } from 'lib/constants'
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

  const compoundPrizePoolBuilderAddress = CONTRACT_ADDRESSES[chainId]['COMPOUND_PRIZE_POOL_BUILDER']
  const compoundPrizePoolBuilderContract = new ethers.Contract(
    compoundPrizePoolBuilderAddress,
    CompoundPrizePoolBuilderAbi,
    signer
  )

  // Determine appropriate Credit Rate based on Exit Fee / Prize Period
  const ticketCreditRateMantissa = ethers.utils.parseEther(ticketCreditLimitMantissa).div(prizePeriodSeconds)

  const prizePeriodStartInt = parseInt(prizePeriodStartAt, 10)
  const prizePeriodStartTimestamp = ((prizePeriodStartInt === 0) ? now() : prizePeriodStartInt).toString()

  const rngServiceAddress = CONTRACT_ADDRESSES[chainId].RNG_SERVICE[rngService]

  const proxyAdmin = ethers.constants.AddressZero




  const compoundPrizePoolConfig = {
    cToken: cTokenAddress,
    maxExitFeeMantissa: toWei(maxExitFeeMantissa),
    maxTimelockDuration,
  }

  const singleRandomWinnerConfig = {
    proxyAdmin,
    rngService: rngServiceAddress,
    prizePeriodStart: prizePeriodStartTimestamp,
    prizePeriodSeconds,
    ticketName,
    ticketSymbol,
    sponsorshipName,
    sponsorshipSymbol,
    ticketCreditLimitMantissa: toWei(ticketCreditLimitMantissa),
    ticketCreditRateMantissa,
    externalERC20Awards,
  }

  try {
    const newTx = await compoundPrizePoolBuilderContract.createSingleRandomWinner(
      compoundPrizePoolConfig,
      singleRandomWinnerConfig,
      {
        gasLimit: 2000000
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
    const compoundPrizePoolCreatedFilter = compoundPrizePoolBuilderContract.filters.CompoundPrizePoolCreated(
      usersAddress,
    )
    const compoundPrizePoolCreatedRawLogs = await provider.getLogs({
      ...compoundPrizePoolCreatedFilter,
      fromBlock: txBlockNumber,
      toBlock: txBlockNumber,
    })
    const compoundPrizePoolCreatedEventLog = compoundPrizePoolBuilderContract.interface.parseLog(
      compoundPrizePoolCreatedRawLogs[0],
    )
    const prizePool = compoundPrizePoolCreatedEventLog.values.prizePool
    const prizeStrategy = compoundPrizePoolCreatedEventLog.values.prizeStrategy


    const singleRandomWinnerCreatedFilter = compoundPrizePoolBuilderContract.filters.SingleRandomWinnerCreated(
      prizeStrategy,
    )
    const singleRandomWinnerCreatedRawLogs = await provider.getLogs({
      ...singleRandomWinnerCreatedFilter,
      fromBlock: txBlockNumber,
      toBlock: txBlockNumber,
    })
    const singleRandomWinnerCreatedEventLog = compoundPrizePoolBuilderContract.interface.parseLog(
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



export const BuilderUI = (props) => {``

  const [resultingContractAddresses, setResultingContractAddresses] = useState({})
  const [cToken, setCToken] = useState('cDai')
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

    const cTokenAddress = CONTRACT_ADDRESSES[chainId][cToken]

    const requiredValues = [
      cTokenAddress,
      rngService,
      sponsorshipName,
      sponsorshipSymbol,
      ticketName,
      ticketSymbol,
      maxExitFeeMantissa,
      maxTimelockDuration,
      ticketCreditLimitMantissa,
    ]

    if (!requiredValues.every(Boolean)) {
      poolToast.error(`Please fill out all fields`)
      console.error(`Missing one or more of sponsorshipName, sponsorshipSymbol, ticketName, ticketSymbol, maxExitFeeMantissa, maxTimelockDuration, ticketCreditLimitMantissa or creditRateMantissa for token ${cToken} on network ${chainId}!`)
      return
    }

    setTx(tx => ({
      ...tx,
      inWallet: true
    }))

    const params = {
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
      className='bg-purple-1200 -mx-8 sm:-mx-0 py-4 px-8 sm:p-10 pb-16 rounded-xl lg:w-3/4 text-base sm:text-lg mb-20'
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
              cToken,
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
              setCToken,
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
            className='font-bold rounded-full text-green-300 border-2 sm:border-4 border-green-300 hover:text-white hover:bg-lightPurple-1000 text-xxs sm:text-base pt-2 pb-2 px-3 sm:px-6 trans'
            onClick={resetState}
          >
            Reset Form
          </button>
        </div>
      </>}

    </div>

  </>
}
