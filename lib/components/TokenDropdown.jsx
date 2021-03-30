import React, { useContext, useMemo, useState } from 'react'

import { CONTRACT_ADDRESSES } from 'lib/constants'
import { DropdownInputGroup } from 'lib/components/DropdownInputGroup'
import { WalletContext } from 'lib/components/WalletContextProvider'

import BatSvg from 'assets/images/bat.svg'
import DaiSvg from 'assets/images/dai.svg'
import CompSvg from 'assets/images/comp.svg'
import UniSvg from 'assets/images/uni.png'
import UsdcSvg from 'assets/images/usdc.svg'
import UsdtSvg from 'assets/images/usdt.svg'
import WbtcSvg from 'assets/images/wbtc.svg'
import ZrxSvg from 'assets/images/zrx.svg'

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
  // TODO: Uncomment when usdt pools work!
  // cUsdt: {
  //   value: 'cUSDT',
  //   view: (
  //     <>
  //       <img src={UsdtSvg} className='inline-block w-6 sm:w-8 mr-3' />
  //       Tether
  //     </>
  //   )
  // },
  cComp: {
    value: 'cCOMP',
    view: (
      <>
        <img src={CompSvg} className='inline-block w-6 sm:w-8 mr-3' />
        COMP
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
  }
})

export const TokenDropdown = (props) => {
  const walletContext = useContext(WalletContext)
  const [currentToken, setCurrentToken] = useState(props.cToken)
  const chainId = walletContext._onboard.getState()?.appNetworkId

  const compoundTokens = useMemo(() => {
    const cTokens = CONTRACT_ADDRESSES[chainId].COMPOUND
    return Object.keys(cTokens).reduce((currentListItems, tokenName) => {
      const listItem = COMPOUND_TOKENS[tokenName]
      if (listItem) {
        currentListItems[tokenName] = listItem
      }
      return currentListItems
    }, {})
  }, [chainId])

  const onValueSet = (newToken) => {
    setCurrentToken(newToken)
    props.onChange(newToken)
  }

  const formatValue = (key) => COMPOUND_TOKENS[key].view

  return (
    <DropdownInputGroup
      id='token-dropdown'
      placeHolder='Select a token to be deposited and used as a yield source'
      label={'Deposit token'}
      formatValue={formatValue}
      onValueSet={onValueSet}
      current={currentToken}
      values={compoundTokens}
    />
  )
}
