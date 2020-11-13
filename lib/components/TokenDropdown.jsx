import React, { useState } from 'react'

import { DropdownInputGroup } from 'lib/components/DropdownInputGroup'

import ABatSvg from 'assets/images/aBAT.svg'
import ADaiSvg from 'assets/images/aDAI.svg'
import AEthSvg from 'assets/images/aETH.svg'
import AKncSvg from 'assets/images/aKNC.svg'
import ALendSvg from 'assets/images/aLEND.svg'
import ALinkSvg from 'assets/images/aLINK.svg'
import AManaSvg from 'assets/images/aMANA.svg'
import AMkrSvg from 'assets/images/aMKR.svg'
import ARepSvg from 'assets/images/aREP.svg'
import ASnxSvg from 'assets/images/aSNX.svg'
import ASusdSvg from 'assets/images/aSUSD.svg'
import ATusdSvg from 'assets/images/aTUSD.svg'
import AUsdcSvg from 'assets/images/aUSDC.svg'
import AUsdtSvg from 'assets/images/aUSDT.svg'
import AWbtcSvg from 'assets/images/aWBTC.svg'
import AZrxSvg from 'assets/images/aZRX.svg'

import BatSvg from 'assets/images/bat.svg'
import DaiSvg from 'assets/images/dai.svg'
import UsdcSvg from 'assets/images/usdc.svg'
import UsdtSvg from 'assets/images/usdt.svg'
import WbtcSvg from 'assets/images/wbtc.svg'
import ZrxSvg from 'assets/images/zrx.svg'

const getTokensList = (yieldService) => {
  switch (yieldService) {
    case 'aave':
      return {
        aDai: {
          value: 'aDai',
          label: (
            <>
              <img src={ADaiSvg} className="inline-block w-6 sm:w-8 mr-3" />
              Dai
            </>
          )
        },
        aUsdc: {
          value: 'aUsdc',
          label: (
            <>
              <img src={AUsdcSvg} className="inline-block w-6 sm:w-8 mr-3" />
              USDC
            </>
          )
        },
        aUsdt: {
          value: 'aUsdt',
          label: (
            <>
              <img src={AUsdtSvg} className="inline-block w-6 sm:w-8 mr-3" />
              Tether
            </>
          )
        },
        aTusd: {
          value: 'aTusd',
          label: (
            <>
              <img src={ATusdSvg} className="inline-block w-6 sm:w-8 mr-3" />
              TUSD
            </>
          )
        },
        aSusd: {
          value: 'aSusd',
          label: (
            <>
              <img src={ASusdSvg} className="inline-block w-6 sm:w-8 mr-3" />
              sUSD
            </>
          )
        },
        aEth: {
          value: 'aEth',
          label: (
            <>
              <img src={AEthSvg} className="inline-block w-6 sm:w-8 mr-3" />
              Ethereum
            </>
          )
        },
        aBat: {
          value: 'aBat',
          label: (
            <>
              <img src={ABatSvg} className="inline-block w-6 sm:w-8 mr-3" />
              Basic Attn Token
            </>
          )
        },
        aKnc: {
          value: 'aKnc',
          label: (
            <>
              <img src={AKncSvg} className="inline-block w-6 sm:w-8 mr-3" />
              Kyber
            </>
          )
        },
        aLend: {
          value: 'aLend',
          label: (
            <>
              <img src={ALendSvg} className="inline-block w-6 sm:w-8 mr-3" />
              LEND
            </>
          )
        },
        aLink: {
          value: 'aLink',
          label: (
            <>
              <img src={ALinkSvg} className="inline-block w-6 sm:w-8 mr-3" />
              LINK
            </>
          )
        },
        aMana: {
          value: 'aMana',
          label: (
            <>
              <img src={AManaSvg} className="inline-block w-6 sm:w-8 mr-3" />
              MANA
            </>
          )
        },
        aMkr: {
          value: 'aMkr',
          label: (
            <>
              <img src={AMkrSvg} className="inline-block w-6 sm:w-8 mr-3" />
              MKR
            </>
          )
        },
        aRep: {
          value: 'aRep',
          label: (
            <>
              <img src={ARepSvg} className="inline-block w-6 sm:w-8 mr-3" />
              Augur
            </>
          )
        },
        aSnx: {
          value: 'aSnx',
          label: (
            <>
              <img src={ASnxSvg} className="inline-block w-6 sm:w-8 mr-3" />
              Synthetix
            </>
          )
        },
        aWbtc: {
          value: 'aWbtc',
          label: (
            <>
              <img src={AWbtcSvg} className="inline-block w-6 sm:w-8 mr-3" />
              Wrapped Bitcoin
            </>
          )
        },
        aZrx: {
          value: 'aZrx',
          label: (
            <>
              <img src={AZrxSvg} className="inline-block w-6 sm:w-8 mr-3" />
              0x
            </>
          )
        }
      }
    case 'compound':
      return {
        cDai: {
          value: 'cDai',
          label: (
            <>
              <img src={DaiSvg} className="inline-block w-6 sm:w-8 mr-3" />
              Dai
            </>
          )
        },
        cUsdc: {
          value: 'cUsdc',
          label: (
            <>
              <img src={UsdcSvg} className="inline-block w-6 sm:w-8 mr-3" />
              USDC
            </>
          )
        },
        cUsdt: {
          value: 'cUsdt',
          label: (
            <>
              <img src={UsdtSvg} className="inline-block w-6 sm:w-8 mr-3" />
              Tether
            </>
          )
        },
        cBat: {
          value: 'cBat',
          label: (
            <>
              <img src={BatSvg} className="inline-block w-6 sm:w-8 mr-3" />
              Basic Attn Token
            </>
          )
        },
        cWbtc: {
          value: 'cWbtc',
          label: (
            <>
              <img src={WbtcSvg} className="inline-block w-6 sm:w-8 mr-3" />
              Wrapped Bitcoin
            </>
          )
        },
        cZrx: {
          value: 'cZrx',
          label: (
            <>
              <img src={ZrxSvg} className="inline-block w-6 sm:w-8 mr-3" />
              0x
            </>
          )
        }
      }
    default:
      break
  }
}

export const TokenDropdown = ({ onChange, yieldService }) => {
  let [currentToken, setCurrentToken] = useState('aDai')
  let tokens = getTokensList(yieldService)

  if (yieldService === 'compound') {
    currentToken = 'cDai'
    tokens = getTokensList(yieldService)
  }

  const onValueSet = (newToken) => {
    setCurrentToken(newToken)
    onChange(newToken)
  }

  const formatValue = (key) => <>{tokens[key].label}</>

  return (
    <>
      <DropdownInputGroup
        id="token-dropdown"
        label={<>{tokens[currentToken].label}</>}
        formatValue={formatValue}
        onValueSet={onValueSet}
        current={currentToken}
        values={tokens}
      />
    </>
  )
}
