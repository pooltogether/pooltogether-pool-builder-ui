import React, { useContext, useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import FeatherIcon from 'feather-icons-react'
import { ethers } from 'ethers'

import PrizePoolBuilderAbi from 'lib/abis/PrizePoolBuilderAbi'
import SingleRandomWinnerPrizePoolBuilderAbi from 'lib/abis/SingleRandomWinnerPrizePoolBuilderAbi'
import { Button } from 'lib/components/Button'
import { Input } from 'lib/components/Input'
import { WalletOnboardContext } from 'lib/components/OnboardState'
import { poolToast } from 'lib/utils/poolToast'

const ADDRESSES = {
  1: {
    cDai: '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643',
    cUsdc: '0x39aa39c021dfbae8fac545936693ac917d5e7563',
  },
  42: {
    cDai: '0xe7bc397dbd069fc7d0109c0636d06888bb50668c',
    cUsdc: '0xcfc9bb230f00bffdb560fce2428b4e05f3442e35',
    SRWPPB_CONTRACT_ADDRESS: '0x9Da27d0B01d65D92d69d043526c15a25344c4016'
  }
}

export const SRWPPBForm = (props) => {

  const [resultingContractAddresses, setResultingContractAddresses] = useState({})
  const [cToken, setCToken] = useState('cDai')
  const [prizePeriodInSeconds, setPrizePeriodInSeconds] = useState('')
  const [_collateralName, setCollateralName] = useState('')
  const [_collateralSymbol, setCollateralSymbol] = useState('')
  const [_ticketName, setTicketName] = useState('')
  const [_ticketSymbol, setTicketSymbol] = useState('')

  const walletOnboardContext = useContext(WalletOnboardContext)

  const digChainIdFromWalletOnboardState = () => {
    const onboard = walletOnboardContext.onboardState.onboard

    let chainId = 1
    if (onboard) {
      chainId = onboard.getState().network
    }
    
    return chainId
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const chainId = digChainIdFromWalletOnboardState()

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
    }

    const provider = walletOnboardContext.onboardState.provider

    const srwppBuilderContract = new ethers.Contract(
      srwppBuilderContractAddress,
      SingleRandomWinnerPrizePoolBuilderAbi,
      provider.getSigner()
    )
    
    try {
      const tx = await srwppBuilderContract.createSingleRandomWinnerPrizePool(
        cTokenAddress,
        3600,
        _collateralName,
        _collateralSymbol,
        _ticketName,
        _ticketSymbol,
        {
          gasLimit: 1000000,
        }
      )



      const blockNumber = await provider.getBlockNumber()
      provider.resetEventsBlock(blockNumber)

      const prizePoolBuilderContractAddress = await srwppBuilderContract.prizePoolBuilder()
      const prizePoolBuilderContract = new ethers.Contract(
        prizePoolBuilderContractAddress,
        PrizePoolBuilderAbi,
        provider.getSigner()
      )

      prizePoolBuilderContract.on('PrizePoolCreated', (
        interestPool,
        prizePool,
        prizeStrategy,
        collateral,
        ticket,
      ) => {
        // only do this once
        if (resultingContractAddresses.ticket === undefined) {
          setResultingContractAddresses({
            interestPool,
            prizePool,
            prizeStrategy,
            collateral,
            ticket,
          })
        }
        console.log('event came in', {
          interestPool,
          prizePool,
          prizeStrategy,
          collateral,
          ticket,
        })
      })

      // console.log(tx.hash)
      await tx.wait()
      // console.log({tx})
      // console.log('done!')
      poolToast.success('Transaction complete!')
    } catch (e) {
      poolToast.error('Error with transaction, ', e.message)
      console.error(e)
    }
  }

  const handleTickerChange = (e) => {
    setCToken(e.target.value)
  }

  const handleCopy = () => {
    poolToast.success(`Copied to clipboard!`)

    // setTimeout(() => {
    //   this.setState({ copied: false })
    // }, 5000)
  }

  return <>
    {(typeof resultingContractAddresses.ticket === 'string') ? <>
      <div
        className='bg-purple-1000 -mx-8 sm:-mx-0 py-4 px-8 sm:p-10 pb-16 rounded-xl lg:w-3/4 text-base sm:text-lg mb-20'
      >
        <div
          className='font-bold mb-8 py-2 text-lg sm:text-xl lg:text-2xl'
        >
          Contracts deployed:
        </div>

        <div
          className='relative mb-4 bg-purple-1200 rounded-lg py-3 px-6 lg:w-2/3'
          style={{
            minHeight: 60
          }}
        >
          <span
            className='text-purple-300 block text-xs sm:text-base'
          >Interest Pool contract address: </span>
          <div className='absolute t-0 r-0 pr-3 pt-3'>
            <CopyToClipboard
              text={resultingContractAddresses.interestPool}
              onCopy={handleCopy}
            >
              <a className='flex flex-col items-center justify-center cursor-pointer stroke-current text-blue-300 hover:text-blue-100 rounded-full bg-lightPurple-900 w-6 h-6 block'>
                <FeatherIcon
                  icon='copy'
                  className='w-4 h-4'
                />
              </a>
            </CopyToClipboard>
          </div>
          <span
            className='text-white font-mono text-sm sm:text-base'
          >{resultingContractAddresses.interestPool}</span>
        </div>
        <div
          className='relative mb-4 bg-purple-1200 rounded-lg py-3 px-6 lg:w-2/3'
          style={{
            minHeight: 60
          }}
        >
          <span
            className='text-purple-300 block text-xs sm:text-base'
          >Prize Pool contract address: </span>
          <div className='absolute t-0 r-0 pr-3 pt-3'>
            <CopyToClipboard
              text={resultingContractAddresses.prizePool}
              onCopy={handleCopy}
            >
              <a className='flex flex-col items-center justify-center cursor-pointer stroke-current text-blue-300 hover:text-blue-100 rounded-full bg-lightPurple-900 w-6 h-6 block'>
                <FeatherIcon
                  icon='copy'
                  className='w-4 h-4'
                />
              </a>
            </CopyToClipboard>
          </div>
          <span
            className='text-white font-mono text-sm sm:text-base'
          >{resultingContractAddresses.prizePool}</span>
        </div>
        <div
          className='relative mb-4 bg-purple-1200 rounded-lg py-3 px-6 lg:w-2/3'
          style={{
            minHeight: 60
          }}
        >
          <span
            className='text-purple-300 block text-xs sm:text-base'
          >Prize Strategy contract address: </span>
          <div className='absolute t-0 r-0 pr-3 pt-3'>
            <CopyToClipboard
              text={resultingContractAddresses.prizeStrategy}
              onCopy={handleCopy}
            >
              <a className='flex flex-col items-center justify-center cursor-pointer stroke-current text-blue-300 hover:text-blue-100 rounded-full bg-lightPurple-900 w-6 h-6 block'>
                <FeatherIcon
                  icon='copy'
                  className='w-4 h-4'
                />
              </a>
            </CopyToClipboard>
          </div>
          <span
            className='text-white font-mono text-sm sm:text-base'
          >{resultingContractAddresses.prizeStrategy}</span>
        </div>
        <div
          className='relative mb-4 bg-purple-1200 rounded-lg py-3 px-6 lg:w-2/3'
          style={{
            minHeight: 60
          }}
        >
          <span
            className='text-purple-300 block text-xs sm:text-base'
          >Collateral contract address: </span>
          <div className='absolute t-0 r-0 pr-3 pt-3'>
            <CopyToClipboard
              text={resultingContractAddresses.collateral}
              onCopy={handleCopy}
            >
              <a className='flex flex-col items-center justify-center cursor-pointer stroke-current text-blue-300 hover:text-blue-100 rounded-full bg-lightPurple-900 w-6 h-6 block'>
                <FeatherIcon
                  icon='copy'
                  className='w-4 h-4'
                />
              </a>
            </CopyToClipboard>
          </div>
          <span
            className='text-white font-mono text-sm sm:text-base'
          >{resultingContractAddresses.collateral}</span>
        </div>
        <div
          className='relative mb-4 bg-purple-1200 rounded-lg py-3 px-6 lg:w-2/3'
          style={{
            minHeight: 60
          }}
        >
          <span
            className='text-purple-300 block text-xs sm:text-base'
          >Ticket contract address: </span>
          <div className='absolute t-0 r-0 pr-3 pt-3'>
            <CopyToClipboard
              text={resultingContractAddresses.ticket}
              onCopy={handleCopy}
            >
              <a className='flex flex-col items-center justify-center cursor-pointer stroke-current text-blue-300 hover:text-blue-100 rounded-full bg-lightPurple-900 w-6 h-6 block'>
                <FeatherIcon
                  icon='copy'
                  className='w-4 h-4'
                />
              </a>
            </CopyToClipboard>
          </div>
          <span
            className='text-white font-mono text-sm sm:text-base'
          >{resultingContractAddresses.ticket}</span>
        </div>
      </div>
    </> : <>
      <form
        onSubmit={handleSubmit}
          className='bg-purple-1000 -mx-8 sm:-mx-0 py-4 px-8 sm:p-10 pb-16 rounded-xl lg:w-3/4 text-base sm:text-lg mb-20'
      >
        <div
          className='font-bold mb-8 py-2 text-lg sm:text-xl lg:text-2xl'
        >
          SRW Pool Parameters:
        </div>

        <label
          htmlFor='prizePeriodInSeconds'
          className='text-purple-300 hover:text-white trans mt-0'
        >cToken to Use:</label>
        <div
          className='inputGroup w-full sm:w-10/12 text-base sm:text-xl lg:text-2xl'
        >
          <input
            id='cDai-radio'
            name='radio'
            type='radio'
            onChange={handleTickerChange}
            value='cDai'
            checked={cToken === 'cDai'}
          />
          <label
            htmlFor='cDai-radio'
            className='text-purple-300 relative pl-6 py-3'
          >cDai</label>
        </div>
        <div
          className='inputGroup w-full sm:w-10/12 text-base sm:text-xl lg:text-2xl'
        >
          <input
            id='cUsdc-radio'
            name='radio'
            type='radio'
            value='cUsdc'
            onChange={handleTickerChange}
            checked={cToken === 'cUsdc'}
          />
          <label
            htmlFor='cUsdc-radio'
            className='text-purple-300 relative pl-6 py-3'
          >cUsdc</label>
        </div>

        <label
          htmlFor='prizePeriodInSeconds'
          className='text-purple-300 hover:text-white trans'
        >
          Prize period (in seconds)
        </label>
        <Input
          id='prizePeriodInSeconds'
          required
          autoFocus
          type='number'
          pattern='\d+'
          onChange={(e) => setPrizePeriodInSeconds(e.target.value)}
          value={prizePeriodInSeconds}
        />

        <label
          htmlFor='_collateralName'
          className='text-purple-300 hover:text-white trans'
        >
          Collateral Name: (eg. 'Sponsorship')
        </label>
        <Input
          required
          id='_collateralName'
          onChange={(e) => setCollateralName(e.target.value)}
          value={_collateralName}
        />



        <label
          htmlFor='_collateralSymbol'
          className='text-purple-300 hover:text-white trans'
        >
          Collateral Name: (eg. 'SPON')
        </label>
        <Input
          required
          id='_collateralSymbol'
          onChange={(e) => setCollateralSymbol(e.target.value)}
          value={_collateralSymbol}
        />


        <label
          htmlFor='_ticketName'
          className='text-purple-300 hover:text-white trans'
        >
          Collateral Name: (eg. 'Ticket')
        </label>
        <Input
          required
          id='_ticketName'
          onChange={(e) => setTicketName(e.target.value)}
          value={_ticketName}
        />

        <label
          htmlFor='_ticketSymbol'
          className='text-purple-300 hover:text-white trans'
        >
          Collateral Name: (eg. 'TICK')
        </label>
        <Input
          required
          id='_ticketSymbol'
          onChange={(e) => setTicketSymbol(e.target.value)}
          value={_ticketSymbol}
        />

        <div
          className='mt-10 mb-0'
        >
          <Button>
            Create SRW Pool          
          </Button>
        </div>
      </form>
    </>}


    
  </>
}
