import React, { useContext, useState } from 'react'
import { ethers } from 'ethers'

import PrizePoolBuilderAbi from 'lib/abis/PrizePoolBuilderAbi'
import SingleRandomWinnerPrizePoolBuilderAbi from 'lib/abis/SingleRandomWinnerPrizePoolBuilderAbi'
import { SRWPPBForm } from 'lib/components/SRWPPBForm'
import { SRWPPBResultPanel } from 'lib/components/SRWPPBResultPanel'
import { TxMessage } from 'lib/components/TxMessage'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { poolToast } from 'lib/utils/poolToast'

const ADDRESSES = {
  1: {
    cDai: '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643',
    cUsdc: '0x39aa39c021dfbae8fac545936693ac917d5e7563',
  },
  31337: {
    cDai: '0x3521eF8AaB0323004A6dD8b03CE890F4Ea3A13f5',
    cUsdc: '0x3521eF8AaB0323004A6dD8b03CE890F4Ea3A13f5',
    SRWPPB_CONTRACT_ADDRESS: '0x7e35Eaf7e8FBd7887ad538D4A38Df5BbD073814a'
  },
  42: {
    cDai: '0xe7bc397dbd069fc7d0109c0636d06888bb50668c',
    cUsdc: '0xcfc9bb230f00bffdb560fce2428b4e05f3442e35',
    SRWPPB_CONTRACT_ADDRESS: '0x63b71d4171893B781b0A38b3853D405846Ce2A38'
  }
}

export const SRWPPBBuilder = (props) => {

  const [resultingContractAddresses, setResultingContractAddresses] = useState({})
  const [cToken, setCToken] = useState('cDai')
  const [prizePeriodInSeconds, setPrizePeriodInSeconds] = useState('987')
  const [_sponsorshipName, setSponsorshipName] = useState('lkj')
  const [_sponsorshipSymbol, setSponsorshipSymbol] = useState('jk')
  const [_ticketName, setTicketName] = useState('lk')
  const [_ticketSymbol, setTicketSymbol] = useState('kgh')
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

    const srwppBuilderContractAddress = ADDRESSES[chainId]['SRWPPB_CONTRACT_ADDRESS']
    const cTokenAddress = ADDRESSES[chainId][cToken]

    if (
      !cTokenAddress ||
      !_sponsorshipName ||
      !_sponsorshipSymbol ||
      !_ticketName ||
      !_ticketSymbol
    ) {
      poolToast.error(`Please fill out all fields`)
      console.error(`One or many of cTokenAddress, _sponsorshipName, _sponsorshipSymbol, _ticketName, or _ticketSymbol for token ${cToken} on network ${chainId} missing!`)
      return
    }

    setTx(tx => ({
      ...tx,
      inWallet: true
    }))

    const provider = walletContext.state.provider
    const signer = provider.getSigner()

    const srwppBuilderContract = new ethers.Contract(
      srwppBuilderContractAddress,
      SingleRandomWinnerPrizePoolBuilderAbi,
      signer
    )
    
    try {
      const newTx = await srwppBuilderContract.createSingleRandomWinnerPrizePool(
        cTokenAddress,
        prizePeriodInSeconds,
        _sponsorshipName,
        _sponsorshipSymbol,
        _ticketName,
        _ticketSymbol,
        {
          gasLimit: 1000000,
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
      const usersAddress = walletContext.state.address

      const srwPoolCreatedFilter = srwppBuilderContract.filters.SingleRandomWinnerPrizePoolCreated(
        usersAddress,
      )

      srwPoolCreatedFilter.fromBlock = txBlockNumber
      srwPoolCreatedFilter.toBlock = txBlockNumber
      
      const srwPoolCreatedRawLogs = await provider.getLogs(srwPoolCreatedFilter)
      const srwPoolCreatedEventLog = srwppBuilderContract.interface.parseLog(
        srwPoolCreatedRawLogs[0],
      )
      const prizePoolAddress = srwPoolCreatedEventLog.values.prizePool

      // event pt2
      const ppBuilderContract = new ethers.Contract(
        (await srwppBuilderContract.prizePoolBuilder()),
        PrizePoolBuilderAbi,
        signer
      )

      const poolCreatedFilter = ppBuilderContract.filters.PrizePoolCreated(
        null,
        prizePoolAddress,
      )

      const poolCreatedRawLogs = await provider.getLogs({...poolCreatedFilter, fromBlock: txBlockNumber, toBlock: txBlockNumber })
      const poolCreatedEventLog = ppBuilderContract.interface.parseLog(
        poolCreatedRawLogs[0],
      )
      const resultingContractAddresses = poolCreatedEventLog.values
      setResultingContractAddresses(resultingContractAddresses)
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

  const txInFlight = tx.inWallet || tx.sent

  console.log({ resultingContractAddresses})
  return <>
    <div
      className='bg-purple-1000 -mx-8 sm:-mx-0 py-4 px-8 sm:p-10 pb-16 rounded-xl lg:w-3/4 text-base sm:text-lg mb-20'
    >
      {(typeof resultingContractAddresses.ticket === 'string') ? <>
        <SRWPPBResultPanel
          resultingContractAddresses={resultingContractAddresses}
        />
      </> : <>
        {txInFlight ? <>
          <TxMessage
            txType='Deploy SRW Prize Pool Contracts'
            tx={tx}
          />
        </> : <>
          <SRWPPBForm
            handleSubmit={handleSubmit}
            vars={{
              cToken,
              prizePeriodInSeconds,
              _sponsorshipName,
              _sponsorshipSymbol,
              _ticketName,
              _ticketSymbol,
            }}
            stateSetters={{
              setCToken,
              setPrizePeriodInSeconds,
              setSponsorshipName,
              setSponsorshipSymbol,
              setTicketName,
              setTicketSymbol,
            }}
          />
      </>}
    </>}

      
      
    </div>
    
  </>
}

