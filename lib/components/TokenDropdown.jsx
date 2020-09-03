import React, { useEffect, useState } from 'react'

import { DropdownInputGroup } from 'lib/components/DropdownInputGroup'

import BatSvg from 'assets/images/bat.svg'
import DaiSvg from 'assets/images/dai.svg'
import UsdcSvg from 'assets/images/usdc.svg'
import UsdtSvg from 'assets/images/usdt.svg'
import ZrxSvg from 'assets/images/zrx.svg'

export const TokenDropdown = (props) => {
  const [currentToken, setCurrentToken] = useState('cDai')

  const tokens = {
    'cDai': {
      value: 'cDai',
      label: <>
        <img src={DaiSvg} className='inline-block w-6 sm:w-8 mr-3' />Dai
      </>
    },
    'cUsdc': {
      value: 'cUsdc',
      label: <>
        <img src={UsdcSvg} className='inline-block w-6 sm:w-8 mr-3' />USDC
      </>
    },
    'cUsdt': {
      value: 'cUsdt',
      label: <>
        <img src={UsdtSvg} className='inline-block w-6 sm:w-8 mr-3' />Tether
      </>
    },
    'cBat': {
      value: 'cBat',
      label: <>
        <img src={BatSvg} className='inline-block w-6 sm:w-8 mr-3' />Basic Attn Token
      </>
    },
    'cZrx': {
      value: 'cZrx',
      label: <>
        <img src={ZrxSvg} className='inline-block w-6 sm:w-8 mr-3' />0x
      </>
    },
  }

  const onValueSet = (newToken) => {
    setCurrentToken(newToken)
    props.onChange(newToken)
  }

  const formatValue = (key) => {
    const token = tokens[key]

    return <>
      {token.label}
    </>
  }

  return <>
    <DropdownInputGroup
      id='token-dropdown'
      label={<>
        {tokens[currentToken].label}
      </>}
      formatValue={formatValue}
      onValueSet={onValueSet}
      current={currentToken}
      values={tokens}
    />

  </>
}