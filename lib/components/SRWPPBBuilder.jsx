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
  42: {
    cDai: '0xe7bc397dbd069fc7d0109c0636d06888bb50668c',
    cUsdc: '0xcfc9bb230f00bffdb560fce2428b4e05f3442e35',
    SRWPPB_CONTRACT_ADDRESS: '0xE8e29B1F9A1dBCA484eCBD82e76b1ae58250a73E'
  }
}

export const SRWPPBBuilder = (props) => {

  const [resultingContractAddresses, setResultingContractAddresses] = useState({})
  const [cToken, setCToken] = useState('cDai')
  const [prizePeriodInSeconds, setPrizePeriodInSeconds] = useState('987')
  const [_collateralName, setCollateralName] = useState('lkj')
  const [_collateralSymbol, setCollateralSymbol] = useState('jk')
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
      !_collateralName ||
      !_collateralSymbol ||
      !_ticketName ||
      !_ticketSymbol
    ) {
      poolToast.error(`Please fill out all fields`)
      console.error(`One or many of cTokenAddress, _collateralName, _collateralSymbol, _ticketName, or _ticketSymbol for token ${cToken} on network ${chainId} missing!`)
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
        _collateralName,
        _collateralSymbol,
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





      // events
      const blockNumber = await provider.getBlockNumber()
      provider.resetEventsBlock(blockNumber)

      const prizePoolBuilderContractAddress = await srwppBuilderContract.prizePoolBuilder()
      const prizePoolBuilderContract = new ethers.Contract(
        prizePoolBuilderContractAddress,
        PrizePoolBuilderAbi,
        provider.getSigner()
      )

      const srwPoolCreatedFilter = srwppBuilderContract.filters.SingleRandomWinnerPrizePoolCreated(
        walletContext.state.address,
        null,
        null,
      )
      srwppBuilderContract.once(srwPoolCreatedFilter, (
        msgSender,
        prizePoolAddress,
        prizeStrategyAddress
      ) => {

        const srwPoolCreatedFilter = prizePoolBuilderContract.filters.PrizePoolCreated(
          null,
          null,
          prizePoolAddress,
        )
        console.log({ srwPoolCreatedFilter})
        prizePoolBuilderContract.once(srwPoolCreatedFilter, (
          creator,
          interestPool,
          prizePool,
          prizeStrategy,
          collateral,
          ticket,
        ) => {
          // only do this once
          if (resultingContractAddresses.ticket === undefined) {
            setResultingContractAddresses({
              creator,
              interestPool,
              prizePool,
              prizeStrategy,
              collateral,
              ticket,
            })
          }
        })

        provider.resetEventsBlock(blockNumber + 2);

      })




      await newTx.wait()

      setTx(tx => ({
        ...tx,
        completed: true,
      }))

      poolToast.success('Transaction complete!')
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
              _collateralName,
              _collateralSymbol,
              _ticketName,
              _ticketSymbol,
            }}
            stateSetters={{
              setCToken,
              setPrizePeriodInSeconds,
              setCollateralName,
              setCollateralSymbol,
              setTicketName,
              setTicketSymbol,
            }}
          />
      </>}
    </>}

      
      
    </div>
    
  </>
}

