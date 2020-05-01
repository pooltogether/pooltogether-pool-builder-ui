import React, { useContext, useState } from 'react'
import { ethers } from 'ethers'
import { Radio } from 'antd'

import { Button } from 'lib/components/Button'
import { Input } from 'lib/components/Input'

import SingleRandomWinnerPrizePoolBuilderAbi from 'lib/abis/SingleRandomWinnerPrizePoolBuilderAbi'
import { WalletOnboardContext } from 'lib/components/OnboardState'

const ADDRESSES = {
  1: {
    cDai: '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643',
    cUsdc: '0x39aa39c021dfbae8fac545936693ac917d5e7563',
  },
  42: {
    cDai: '0xe7bc397dbd069fc7d0109c0636d06888bb50668c',
    cUsdc: '0xcfc9bb230f00bffdb560fce2428b4e05f3442e35',
  }
}

export const SRWPPBForm = (props) => {

  const [cToken, setCToken] = useState('cDai')
  const [prizePeriodInSeconds, setPrizePeriodInSeconds] = useState()
  const [_collateralName, setCollateralName] = useState()
  const [_collateralSymbol, setCollateralSymbol] = useState()
  const [_ticketName, setTicketName] = useState()
  const [_ticketSymbol, setTicketSymbol] = useState()

  // CTokenInterface cToken,
  // uint256 prizePeriodInSeconds,
  // string calldata _collateralName,
  // string calldata _collateralSymbol,
  // string calldata _ticketName,
  // string calldata _ticketSymbol

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

    const cTokenAddress = ADDRESSES[chainId][cToken]

    if (!cTokenAddress) {
      console.error(`cTokenAddress for token ${cToken} on network ${chainId} missing!`)
    }

    if (!_collateralName) {
    }

    const provider = walletOnboardContext.onboardState.provider

    // let poolBuilderFactory = new ethers.ContractFactory(
    //   SingleRandomWinnerPrizePoolBuilderAbi,
    //   SingleRandomWinnerPrizePoolBuilderBytecode,
    //   provider.getSigner()
    // )
    const builderContract = new ethers.Contract(
      '0x9Da27d0B01d65D92d69d043526c15a25344c4016', // kovan
      SingleRandomWinnerPrizePoolBuilderAbi,
      provider.getSigner()
    )
    
    try {
      const tx = await builderContract.createSingleRandomWinnerPrizePool(
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

      console.log(tx.hash)
      await tx.wait()
      console.log('done!')
      // poolToast.error()
    } catch (e) {
      // poolToast.error()
      console.error(e)
    }
  }

  const handleTickerChange = (e) => {
    e.preventDefault()

    setCToken(e.target.value)
  }
  
  return <>
    <form
      onSubmit={handleSubmit}
      className='bg-purple-1000 p-10 rounded-xl lg:w-2/3 text-base sm:text-lg'
    >
      <Radio.Group
        onChange={handleTickerChange}
        value={cToken}
      >
        <Radio
          defaultChecked
          value='cDai'
        >
          cDai
        </Radio>
        <Radio
          value='cUsdc'
        >
          cUsdc
        </Radio>
      </Radio.Group>

      <label
        htmlFor='prizePeriodInSeconds'
        className='text-purple-300 hover:text-white trans'
      >
        Prize period (in seconds)
      </label>
      <Input
        id='prizePeriodInSeconds'
        autoFocus
        type='number'
        pattern='\d+'
        handleChange={(e) => setPrizePeriodInSeconds(e.target.value)}
        value={prizePeriodInSeconds}
      />

      <label
        htmlFor='_collateralName'
        className='text-purple-300 hover:text-white trans'
      >
        Collateral Name: (eg. 'Sponsorship')
      </label>
      <Input
        id='_collateralName'
        handleChange={(e) => setCollateralName(e.target.value)}
        value={_collateralName}
      />



      <label
        htmlFor='_collateralSymbol'
        className='text-purple-300 hover:text-white trans'
      >
        Collateral Name: (eg. 'SPON')
      </label>
      <Input
        id='_collateralSymbol'
        handleChange={(e) => setCollateralSymbol(e.target.value)}
        value={_collateralSymbol}
      />


      <label
        htmlFor='_ticketName'
        className='text-purple-300 hover:text-white trans'
      >
        Collateral Name: (eg. 'Ticket')
      </label>
      <Input
        id='_ticketName'
        handleChange={(e) => setTicketName(e.target.value)}
        value={_ticketName}
      />

      <label
        htmlFor='_ticketSymbol'
        className='text-purple-300 hover:text-white trans'
      >
        Collateral Name: (eg. 'TICK')
      </label>
      <Input
        id='_ticketSymbol'
        handleChange={(e) => setTicketSymbol(e.target.value)}
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
  </>
}
