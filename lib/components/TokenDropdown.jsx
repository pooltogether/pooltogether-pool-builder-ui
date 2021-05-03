import React, { useMemo, useState } from 'react'

import { CONTRACT_ADDRESSES } from 'lib/constants'
import { DropdownInputGroup } from 'lib/components/DropdownInputGroup'
import { useWalletNetwork } from 'lib/hooks/useWalletNetwork'

// import BatSvg from 'assets/images/bat.svg'
// import DaiSvg from 'assets/images/dai.svg'
// import CompSvg from 'assets/images/comp.svg'
// import UniSvg from 'assets/images/uni.png'
// import UsdcSvg from 'assets/images/usdc.svg'
// import UsdtSvg from 'assets/images/usdt.svg'
// import WbtcSvg from 'assets/images/wbtc.svg'
// import ZrxSvg from 'assets/images/zrx.svg'

export const YIELD_TOKEN_OPTIONS = Object.freeze({
  cDai: {
    value: 'cDAI',
    label: (
      <>
        {/* <img src={DaiSvg} className='inline-block w-6 sm:w-8 mr-3' /> */}
        Dai
      </>
    )
  },
  cUsdc: {
    value: 'cUSDC',
    label: (
      <>
        {/* <img src={UsdcSvg} className='inline-block w-6 sm:w-8 mr-3' /> */}
        USDC
      </>
    )
  },
  cUsdt: {
    value: 'cUSDT',
    view: (
      <>
        {/* <img src={UsdtSvg} className='inline-block w-6 sm:w-8 mr-3' /> */}
        Tether
      </>
    )
  },
  cComp: {
    value: 'cCOMP',
    label: (
      <>
        {/* <img src={CompSvg} className='inline-block w-6 sm:w-8 mr-3' /> */}
        COMP
      </>
    )
  },
  cUni: {
    value: 'cUNI',
    label: (
      <>
        {/* <img src={UniSvg} className='inline-block w-6 sm:w-8 mr-3' /> */}
        UNI
      </>
    )
  },
  cBat: {
    value: 'cBAT',
    label: (
      <>
        {/* <img src={BatSvg} className='inline-block w-6 sm:w-8 mr-3' /> */}
        Basic Attn Token
      </>
    )
  },
  cWbtc: {
    value: 'cWBTC',
    label: (
      <>
        {/* <img src={WbtcSvg} className='inline-block w-6 sm:w-8 mr-3' /> */}
        Wrapped Bitcoin
      </>
    )
  },
  cZrx: {
    value: 'cZRX',
    label: (
      <>
        {/* <img src={ZrxSvg} className='inline-block w-6 sm:w-8 mr-3' /> */}
        0x
      </>
    )
  },
  fFei8: {
    value: 'fFEI',
    label: (
      <>
        {/* <img src='' className='inline-block w-6 sm:w-8 mr-3' /> */}
        FEI
      </>
    )
  },
  fTribe8: {
    value: 'fTRIBE',
    label: (
      <>
        {/* <img src='' className='inline-block w-6 sm:w-8 mr-3' /> */}
        TRIBE
      </>
    )
  }
})

export const TokenDropdown = (props) => {
  const [currentToken, setCurrentToken] = useState(props.cToken)

  const { walletChainId } = useWalletNetwork()

  const compoundTokens = useMemo(() => {
    const cTokens = CONTRACT_ADDRESSES[walletChainId]?.COMPOUND

    if (!cTokens) {
      return {}
    }

    return Object.keys(cTokens).reduce((currentListItems, tokenName) => {
      const listItem = YIELD_TOKEN_OPTIONS[tokenName]
      if (listItem) {
        currentListItems[tokenName] = listItem
      }
      return currentListItems
    }, {})
  }, [walletChainId])

  const onValueSet = (newToken) => {
    setCurrentToken(newToken)
    props.onChange(newToken)
  }

  const formatValue = (key) => YIELD_TOKEN_OPTIONS[key].label

  return (
    <DropdownInputGroup
      id='token-dropdown'
      placeHolder='Select a token to be deposited and used as a yield source'
      label={'Deposit token'}
      formatValue={formatValue}
      onValueSet={onValueSet}
      current={currentToken}
      options={compoundTokens}
    />
    // <DropdownInputGroup
    // />
  )
}
