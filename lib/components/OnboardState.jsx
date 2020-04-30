// import App from 'next/app'
import React, { useState } from 'react'
import { ethers } from 'ethers'
import Onboard from 'bnc-onboard'

const INFURA_KEY = process.env.NEXT_JS_INFURA_KEY
const FORTMATIC_KEY = process.env.NEXT_JS_FORTMATIC_API_KEY

const WALLETS_CONFIG = [
  { walletName: "coinbase", preferred: true },
  // { walletName: "trust", preferred: true, rpcUrl: RPC_URL },
  { walletName: "metamask", preferred: true },
  { walletName: "dapper" },
  // {
  //   walletName: 'trezor',
  //   appUrl: APP_URL,
  //   email: CONTACT_EMAIL,
  //   rpcUrl: RPC_URL,
  //   preferred: true
  // },
  // {
  //   walletName: 'ledger',
  //   rpcUrl: RPC_URL,
  //   preferred: true
  // },
  {
    walletName: "fortmatic",
    apiKey: FORTMATIC_KEY,
    preferred: true
  },
  // rpcUrl: process.env.NEXT_JS_FORTMATIC_CUSTOM_NODE_URL,
  {
    walletName: "authereum",
    preferred: true
  },
  {
    walletName: "walletConnect",
    infuraKey: INFURA_KEY,
    preferred: true
  },
  { walletName: "torus" },
  { walletName: "status" },
  { walletName: "unilogin" },
  // { walletName: "imToken", rpcUrl: RPC_URL }
]


export const OnboardState = ({
  children
}) => {
  let [onboard, setOnboard] = useState()
  let [onboardConfig, setOnboardConfig] = useState()
  let [address, setAddress] = useState()

  let {
    wallet,
    provider
  } = onboardConfig || {}

  if (!onboard) {
    onboard = Onboard({
      dappId: '77ae9152-5956-40aa-b745-4bb96d97fdfb',       // [String] The API key created by step one above
      networkId: 1,  // [Integer] The Ethereum network ID your Dapp uses.
      darkMode: true,
      walletSelect: {
        wallets: WALLETS_CONFIG,
      },
      subscriptions: {
        wallet: w => {
          setOnboardConfig({
            wallet: w,
            provider: new ethers.providers.Web3Provider(w.provider)
          })
        }
      }
    })
    
    setOnboard(onboard)
  }

  const handleConnectWallet = async () => {
    await onboard.walletSelect()

    const currentState = onboard.getState()

    

    if (currentState.wallet.type) {
      await onboard.walletCheck()

      const p = currentState.wallet.provider

      if (p && p.selectedAddress) {
        // trigger re-render
        setAddress('')
      }
    }
  }

  if (provider && !address) {
    provider.listAccounts().then(accounts => {
      
      setAddress(accounts[0])
    })
  }

  return <>
    {React.cloneElement(children, {
      handleConnectWallet,
      onboard,
      onboardConfig
    })}
  </>
}
