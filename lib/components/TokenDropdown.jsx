import React, { useState } from 'react'

import { DropdownInputGroup } from 'lib/components/DropdownInputGroup'

import BatSvg from 'assets/images/bat.svg'
import DaiSvg from 'assets/images/dai.svg'
import UsdcSvg from 'assets/images/usdc.svg'
import UsdtSvg from 'assets/images/usdt.svg'
import WbtcSvg from 'assets/images/wbtc.svg'
import ZrxSvg from 'assets/images/zrx.svg'
import { DropdownInputGroup2 } from 'lib/components/DropdownInputGroup'

export const TokenDropdown = props => {
  const [currentToken, setCurrentToken] = useState(props.cToken)

  const tokens = {
    cDai: {
      value: 'cDai',
      view: (
        <>
          <img src={DaiSvg} className='inline-block w-6 sm:w-8 mr-3' />
          Dai
        </>
      )
    },
    cUsdc: {
      value: 'cUsdc',
      view: (
        <>
          <img src={UsdcSvg} className='inline-block w-6 sm:w-8 mr-3' />
          USDC
        </>
      )
    },
    cUsdt: {
      value: 'cUsdt',
      view: (
        <>
          <img src={UsdtSvg} className='inline-block w-6 sm:w-8 mr-3' />
          Tether
        </>
      )
    },
    cBat: {
      value: 'cBat',
      view: (
        <>
          <img src={BatSvg} className='inline-block w-6 sm:w-8 mr-3' />
          Basic Attn Token
        </>
      )
    },
    cWbtc: {
      value: 'cWbtc',
      view: (
        <>
          <img src={WbtcSvg} className='inline-block w-6 sm:w-8 mr-3' />
          Wrapped Bitcoin
        </>
      )
    },
    cZrx: {
      value: 'cZrx',
      view: (
        <>
          <img src={ZrxSvg} className='inline-block w-6 sm:w-8 mr-3' />
          0x
        </>
      )
    }
  }

  const onValueSet = newToken => {
    setCurrentToken(newToken)
    props.onChange(newToken)
  }

  const formatValue = key => tokens[key].view

  return (
    <>
      <DropdownInputGroup
        id='token-dropdown'
        label={'Deposit token'}
        formatValue={formatValue}
        onValueSet={onValueSet}
        current={currentToken}
        values={tokens}
      />
    </>
  )
}
