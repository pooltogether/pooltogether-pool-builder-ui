import React, { useContext, useMemo, useState } from 'react'

import { DropdownInputGroup } from 'lib/components/DropdownInputGroup'

import BatSvg from 'assets/images/bat.svg'
import DaiSvg from 'assets/images/dai.svg'
import UniSvg from 'assets/images/uni.svg'
import UsdcSvg from 'assets/images/usdc.svg'
import UsdtSvg from 'assets/images/usdt.svg'
import WbtcSvg from 'assets/images/wbtc.svg'
import ZrxSvg from 'assets/images/zrx.svg'
import { WalletContext } from 'lib/components/WalletContextProvider'

export const COMPOUND_TOKENS = Object.freeze({
  cDai: {
    value: 'cDAI',
    view: (
      <>
        <img src={DaiSvg} className='inline-block w-6 sm:w-8 mr-3' />
        Dai
      </>
    )
  },
  cUsdc: {
    value: 'cUSDC',
    view: (
      <>
        <img src={UsdcSvg} className='inline-block w-6 sm:w-8 mr-3' />
        USDC
      </>
    )
  },
  cUsdt: {
    value: 'cUSDT',
    view: (
      <>
        <img src={UsdtSvg} className='inline-block w-6 sm:w-8 mr-3' />
        Tether
      </>
    )
  },
  cBat: {
    value: 'cBAT',
    view: (
      <>
        <img src={BatSvg} className='inline-block w-6 sm:w-8 mr-3' />
        Basic Attn Token
      </>
    )
  },
  cWbtc: {
    value: 'cWBTC',
    view: (
      <>
        <img src={WbtcSvg} className='inline-block w-6 sm:w-8 mr-3' />
        Wrapped Bitcoin
      </>
    )
  },
  cZrx: {
    value: 'cZRX',
    view: (
      <>
        <img src={ZrxSvg} className='inline-block w-6 sm:w-8 mr-3' />
        0x
      </>
    )
  },
  cUni: {
    value: 'cUNI',
    view: (
      <>
        <img src={UniSvg} className='inline-block w-6 sm:w-8 mr-3' />
        UNI
      </>
    )
  }
})

export const TokenDropdown = (props) => {
  const walletContext = useContext(WalletContext)
  const [currentToken, setCurrentToken] = useState(props.cToken)
  const chainId = walletContext._onboard.getState()?.appNetworkId

  const compoundTokens = useMemo(() => {
    let compoundTokens = Object.assign({}, COMPOUND_TOKENS)
    if (chainId !== 1) {
      delete compoundTokens.cUni
    }
    return compoundTokens
  }, [chainId])

  const onValueSet = (newToken) => {
    setCurrentToken(newToken)
    props.onChange(newToken)
  }

  const formatValue = (key) => COMPOUND_TOKENS[key].view

  return (
    <>
      <DropdownInputGroup
        id='token-dropdown'
        placeHolder='Select a token to be deposited and used as a yield source'
        label={'Deposit token'}
        formatValue={formatValue}
        onValueSet={onValueSet}
        current={currentToken}
        values={compoundTokens}
      />
    </>
  )
}
