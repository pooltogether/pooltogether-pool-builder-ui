import { useState } from 'react'
import { ethers } from 'ethers'
import Onboard from 'bnc-onboard'

import { Button } from 'lib/components/Button'

import PoolAbi from './PoolAbi'

export const SRWPPBForm = () => {
  let [cToken, setCToken] = useState()
  let [prizePeriodInSeconds, setPrizePeriodInSeconds] = useState()
  let [_collateralName, setCollateralName] = useState()
  let [_collateralSymbol, setCollateralSymbol] = useState()
  let [_ticketName, setTicketName] = useState()
  let [_ticketSymbol, setTicketSymbol] = useState()

  // CTokenInterface cToken,
  // uint256 prizePeriodInSeconds,
  // string calldata _collateralName,
  // string calldata _collateralSymbol,
  // string calldata _ticketName,
  // string calldata _ticketSymbol

  const handleSubmit = async (e) => {
    e.preventDefault()

    // let daiPool = new ethers.Contract(DAI_ADDRESS, PoolAbi, provider.getSigner())
    // let usdcPool = new ethers.Contract(USDC_ADDRESS, PoolAbi, provider.getSigner())

    // if (!_collateralName) {
    //   daiPool.totalBalanceOf(cToken).then((balance) => {
    //     setCollateralName(balance)
    //   })
    // }

    // withdrawUsdc = () => {
    //   usdcPool['withdraw()']({ gasLimit: 1000000 })
    // }

    // withdrawDai = () => {
    //   daiPool['withdraw()']({ gasLimit: 1000000 })
    // }

    // if (!_collateralSymbol) {
    //   usdcPool.totalBalanceOf(cToken).then((balance) => {
    //     setUsdcBalance(balance)
    //   })
    // }

  }
  
  return (
    <>
      <form
        onSubmit={handleSubmit}
      >
        <Button>
          Create SRW Pool          
        </Button>
      </form>
      
    </>
  )
}
