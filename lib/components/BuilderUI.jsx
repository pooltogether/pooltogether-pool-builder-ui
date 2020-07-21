import React, { useContext, useState } from 'react'
import { ethers } from 'ethers'

import PrizeStrategyBuilderAbi from '@pooltogether/pooltogether-contracts/abis/PrizeStrategyBuilder'

import { CONTRACT_ADDRESSES } from 'lib/constants'
import { BuilderForm } from 'lib/components/BuilderForm'
import { BuilderResultPanel } from 'lib/components/BuilderResultPanel'
import { TxMessage } from 'lib/components/TxMessage'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { poolToast } from 'lib/utils/poolToast'


const toWei = ethers.utils.parseEther

const sendPrizeStrategyTx = async (params, walletContext, chainId, setTx, setResultingContractAddresses) => {
  const usersAddress = walletContext.state.address
  const provider = walletContext.state.provider
  const signer = provider.getSigner()

  const {
    cTokenAddress,
    prizePeriodSeconds,
    ticketName,
    ticketSymbol,
    sponsorshipName,
    sponsorshipSymbol,
    maxExitFeeMultiple,
    maxTimelockDuration,
    exitFeeMantissa,
    creditRateMantissa,
    externalAwards,
  } = params

  const prizeStrategyBuilderContractAddress = CONTRACT_ADDRESSES[chainId]['PRIZE_STRATEGY_BUILDER']
  const prizeStrategyBuilderContract = new ethers.Contract(
    prizeStrategyBuilderContractAddress,
    PrizeStrategyBuilderAbi,
    signer
  )

  const funcParams = {
    cToken: cTokenAddress,
    prizePeriodSeconds,
    ticketName,
    ticketSymbol,
    sponsorshipName,
    sponsorshipSymbol,
    maxExitFeeMultiple,
    maxTimelockDuration,
    exitFeeMantissa: toWei(exitFeeMantissa),
    creditRateMantissa: toWei(creditRateMantissa),
    externalAwards,
  }

  try {
    const newTx = await prizeStrategyBuilderContract.create(funcParams,
      {
        gasLimit: 5000000
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
    const prizeStrategyBuiltFilter = prizeStrategyBuilderContract.filters.PrizeStrategyBuilt(
      usersAddress,
    )

    const prizeStrategyBuiltRawLogs = await provider.getLogs({
      ...prizeStrategyBuiltFilter,
      fromBlock: txBlockNumber,
      toBlock: txBlockNumber,
    })
    const prizeStrategyBuiltEventLog = prizeStrategyBuilderContract.interface.parseLog(
      prizeStrategyBuiltRawLogs[0],
    )
    const prizePool = prizeStrategyBuiltEventLog.values.prizePool
    const prizeStrategy = prizeStrategyBuiltEventLog.values.prizeStrategy

    setResultingContractAddresses({
      prizePool,
      prizeStrategy,
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



export const BuilderUI = (props) => {

  const [resultingContractAddresses, setResultingContractAddresses] = useState({})
  const [cToken, setCToken] = useState('cDai')
  const [prizePeriodSeconds, setPrizePeriodSeconds] = useState('60')
  const [sponsorshipName, setSponsorshipName] = useState('Sponsorship')
  const [sponsorshipSymbol, setSponsorshipSymbol] = useState('SPON')
  const [ticketName, setTicketName] = useState('Ticket')
  const [ticketSymbol, setTicketSymbol] = useState('TICK')
  const [maxExitFeeMultiple, setMaxExitFeeMultiple] = useState('50')
  const [maxTimelockDuration, setMaxTimelockDuration] = useState('1000')
  const [exitFeeMantissa, setExitFeeMantissa] = useState('0.1')
  const [creditRateMantissa, setCreditRateMantissa] = useState('0.001')
  const [externalAwards, setExternalAwards] = useState([])
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
      sponsorshipName,
      sponsorshipSymbol,
      ticketName,
      ticketSymbol,
      maxExitFeeMultiple,
      maxTimelockDuration,
      exitFeeMantissa,
      creditRateMantissa,
    ]

    if (!requiredValues.every(Boolean)) {
      poolToast.error(`Please fill out all fields`)
      console.error(`Missing one or more of sponsorshipName, sponsorshipSymbol, ticketName, ticketSymbol, maxExitFeeMultiple, maxTimelockDuration, exitFeeMantissa or creditRateMantissa for token ${cToken} on network ${chainId}!`)
      return
    }

    setTx(tx => ({
      ...tx,
      inWallet: true
    }))

    const params = {
      cTokenAddress,
      prizePeriodSeconds,
      ticketName,
      ticketSymbol,
      sponsorshipName,
      sponsorshipSymbol,
      maxExitFeeMultiple,
      maxTimelockDuration,
      exitFeeMantissa,
      creditRateMantissa,
      externalAwards,
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
              prizePeriodSeconds,
              sponsorshipName,
              sponsorshipSymbol,
              ticketName,
              ticketSymbol,
              maxExitFeeMultiple,
              maxTimelockDuration,
              exitFeeMantissa,
              creditRateMantissa,
              externalAwards,
            }}
            stateSetters={{
              setCToken,
              setPrizePeriodSeconds,
              setSponsorshipName,
              setSponsorshipSymbol,
              setTicketName,
              setTicketSymbol,
              setMaxExitFeeMultiple,
              setMaxTimelockDuration,
              setExitFeeMantissa,
              setCreditRateMantissa,
              setExternalAwards,
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
