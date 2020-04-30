import React, { useContext, useState } from 'react'
import { ethers } from 'ethers'

import { Button } from 'lib/components/Button'

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
        'Tai Sponsorship',
        'TAISPON',
        'Pool Tai',
        'PLTAI',
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
    >
      <select
        onChange={handleTickerChange}
        defaultValue={'cDai'}
        className='block text-black'
      >
        <option value='cDai'>cDai</option>
        <option value='cUsdc'>cUsdc</option>
      </select>

      <Button>
        Create SRW Pool          
      </Button>
    </form>
  </>
}
