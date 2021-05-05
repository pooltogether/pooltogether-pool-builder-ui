import React, { useState } from 'react'
import Onboard from '@pooltogether/bnc-onboard'
import Cookies from 'js-cookie'
import { ethers } from 'ethers'
import { isMobile } from 'react-device-detect'

import { nameToChainId } from 'lib/utils/nameToChainId'
import { getInjectedProviderName } from 'lib/utils/getInjectedProviderName'

const debug = require('debug')('WalletContextProvider')

const INFURA_ID = process.env.NEXT_JS_INFURA_ID
const FORTMATIC_KEY = process.env.NEXT_JS_FORTMATIC_API_KEY
const PORTIS_KEY = process.env.NEXT_JS_PORTIS_API_KEY

const SELECTED_WALLET_COOKIE_KEY = 'selectedWallet'

let networkName = 'mainnet'
const RPC_URL =
  networkName && INFURA_ID
    ? `https://${networkName}.infura.io/v3/${INFURA_ID}`
    : 'http://localhost:8545'

let cookieOptions = { sameSite: 'strict' }
if (process.env.NEXT_JS_DOMAIN_NAME) {
  cookieOptions = {
    ...cookieOptions,
    domain: `.${process.env.NEXT_JS_DOMAIN_NAME}`
  }
}

const APP_NAME = 'PoolTogether Pool Builder'

const walletConnectOptions = {
  infuraKey: INFURA_ID,
  preferred: true,
  bridge: 'https://pooltogether.bridge.walletconnect.org/'
}

const WALLETS_CONFIG = [
  { walletName: 'metamask', preferred: true },
  {
    walletName: 'walletConnect',
    ...walletConnectOptions
  },
  { walletName: 'rainbow', preferred: true, ...walletConnectOptions },
  { walletName: 'argent', preferred: true, ...walletConnectOptions },
  { walletName: 'trustWallet', preferred: true, ...walletConnectOptions },
  { walletName: 'gnosisSafe', preferred: true, ...walletConnectOptions },
  { walletName: 'trust', preferred: true, rpcUrl: RPC_URL },
  { walletName: 'coinbase', preferred: true },
  {
    walletName: 'walletLink',
    preferred: true,
    rpcUrl: RPC_URL
  },
  {
    walletName: 'trezor',
    preferred: true,
    appUrl: 'https://app.pooltogether.com',
    email: 'hello@pooltogether.com',
    rpcUrl: RPC_URL
  },
  {
    walletName: 'ledger',
    preferred: true,
    rpcUrl: RPC_URL
  },
  {
    walletName: 'fortmatic',
    preferred: true,
    apiKey: FORTMATIC_KEY
  },
  {
    walletName: 'imToken',
    preferred: true,
    rpcUrl: RPC_URL
  },
  {
    walletName: 'dcent',
    preferred: true
  },
  {
    walletName: 'huobiwallet',
    preferred: true,
    rpcUrl: RPC_URL
  },
  {
    walletName: 'portis',
    preferred: true,
    apiKey: PORTIS_KEY
  },
  {
    walletName: 'authereum',
    preferred: true
  },
  {
    walletName: 'status',
    preferred: true
  },
  {
    walletName: 'torus',
    preferred: true
  },
  {
    walletName: 'lattice',
    preferred: true,
    rpcUrl: RPC_URL,
    appName: APP_NAME
  },
  {
    walletName: 'mykey',
    preferred: true,
    rpcUrl: RPC_URL
  },
  {
    walletName: 'opera',
    preferred: true
  },
  {
    walletName: 'operaTouch',
    preferred: true
  },
  {
    walletName: 'web3Wallet',
    preferred: true
  }
]

export const WalletContext = React.createContext()

let _onboard

const initializeOnboard = (setOnboardState) => {
  _onboard = Onboard({
    hideBranding: true,
    networkId: nameToChainId(networkName),
    darkMode: true,
    walletSelect: {
      wallets: WALLETS_CONFIG
    },
    subscriptions: {
      address: async (a) => {
        debug('address change')
        debug(a)
        setAddress(setOnboardState)
      },
      balance: async (balance) => {
        setOnboardState((previousState) => ({
          ...previousState,
          onboard: _onboard,
          timestamp: Date.now()
        }))
      },
      network: async (n) => {
        debug('network change')
        debug('new network id', n)
        await _onboard.config({ networkId: n })
        setOnboardState((previousState) => ({
          ...previousState,
          network: n
        }))
      },
      wallet: (w) => {
        debug({ w })
        if (!w.name) {
          disconnectWallet(setOnboardState)
        } else {
          connectWallet(w, setOnboardState)

          setAddress(setOnboardState)
        }
      }
    }
  })
}

const doConnectWallet = async (walletType, setOnboardState) => {
  setOnboardState((previousState) => ({
    ...previousState,
    timestamp: Date.now()
  }))

  // walletType is optional here:
  await _onboard.walletSelect(walletType)
  const currentState = _onboard.getState()
  debug({ currentState })

  if (currentState.wallet.type) {
    debug('run walletCheck')
    await _onboard.walletCheck()
    debug('walletCheck done')
    debug({ currentState: _onboard.getState() })

    // trigger re-render
    setOnboardState((previousState) => ({
      ...previousState,
      timestamp: Date.now()
    }))
  }
}

const connectWallet = (w, setOnboardState) => {
  Cookies.set(SELECTED_WALLET_COOKIE_KEY, w.name, cookieOptions)

  const provider = new ethers.providers.Web3Provider(w.provider, 'any')

  setOnboardState((previousState) => ({
    ...previousState,
    address: undefined,
    wallet: w,
    provider
  }))
}

const disconnectWallet = (setOnboardState) => {
  Cookies.remove(SELECTED_WALLET_COOKIE_KEY, cookieOptions)

  setOnboardState((previousState) => ({
    ...previousState,
    address: undefined,
    wallet: undefined,
    provider: undefined
  }))
}

const onPageLoad = async (setOnboardState) => {
  const previouslySelectedWallet = Cookies.get(SELECTED_WALLET_COOKIE_KEY)

  // Use previously set Cookie to auto-connect wallet
  // or auto-connect a known mobile Dapp browser wallet
  if (previouslySelectedWallet) {
    debug('using cookie')
    alert('cookie')
    alert(previouslySelectedWallet)

    doConnectWallet(previouslySelectedWallet, setOnboardState)
  } else if (isMobile) {
    const injectedProviderName = getInjectedProviderName()
    const isImToken = injectedProviderName === 'imToken'
    const isTrust = injectedProviderName === 'Trust'
    const isStatus = injectedProviderName === 'Status'
    const isCoinbase = injectedProviderName === 'Coinbase'
    const isMetaMask = injectedProviderName === 'MetaMask'
    const isWeb3Wallet = injectedProviderName === 'web3Wallet'

    const isAutoConnectableWallet =
      isImToken || isTrust || isStatus || isCoinbase || isMetaMask || isWeb3Wallet

    if (isAutoConnectableWallet) {
      alert('auto')
      alert(injectedProviderName)
      doConnectWallet(injectedProviderName, setOnboardState)
    }
  }
}

const setAddress = (setOnboardState) => {
  debug('running setAddress')
  const currentState = _onboard.getState()

  try {
    const provider = currentState.wallet.provider
    let address = null

    if (provider) {
      address = provider.selectedAddress
      debug('setting address to: ', address)
    } else {
      debug('no provider, setting address: to null')
    }

    // trigger re-render
    setOnboardState((previousState) => ({
      ...previousState,
      address,
      timestamp: Date.now()
    }))
  } catch (e) {
    console.error(e)
  }
}

export const WalletContextProvider = (props) => {
  const [onboardState, setOnboardState] = useState()

  if (!onboardState) {
    initializeOnboard(setOnboardState)

    onPageLoad(setOnboardState)

    setOnboardState((previousState) => ({
      ...previousState,
      onboard: _onboard
    }))
  }

  const handleConnectWallet = () => {
    if (onboardState) {
      doConnectWallet(null, setOnboardState)
    }
  }

  return (
    <WalletContext.Provider
      value={{
        handleConnectWallet,
        state: onboardState,
        _onboard
      }}
    >
      {props.children}
    </WalletContext.Provider>
  )
}
