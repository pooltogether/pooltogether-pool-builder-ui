import { useState } from 'react'
import { ethers } from 'ethers'
import Onboard from 'bnc-onboard'

import PoolAbi from './PoolAbi'

export default function Home() {
  var DAI_ADDRESS = '0x29fe7D60DdF151E5b52e5FAB4f1325da6b2bD958'
  var USDC_ADDRESS = '0x0034ea9808e620a0ef79261c51af20614b742b24'

  let [onboard, setOnboard] = useState()
  let [config, setConfig] = useState()
  let [address, setAddress] = useState()
  let [daiBalance, setDaiBalance] = useState()
  let [usdcBalance, setUsdcBalance] = useState()

  let {
    provider, wallet
  } = config || {}

  if (!onboard) {
    onboard = Onboard({
      dappId: '77ae9152-5956-40aa-b745-4bb96d97fdfb',       // [String] The API key created by step one above
      networkId: 1,  // [Integer] The Ethereum network ID your Dapp uses.
      subscriptions: {
        wallet: w => {
          setConfig({
            wallet: w,
            provider: new ethers.providers.Web3Provider(w.provider)
          })
        }
      }
    });
    setOnboard(onboard)
  }

  function connectWallet() {
    onboard.walletSelect()
  }

  let withdrawUsdc = () => alert('not connected')
  let withdrawDai = () => alert('not connected')

  if (provider) {
    if (!address) {
      console.log(provider)
      provider.listAccounts().then(accounts => {
        setAddress(accounts[0])
      })
    }

    

    if (address) {
      let daiPool = new ethers.Contract(DAI_ADDRESS, PoolAbi, provider.getSigner())
      let usdcPool = new ethers.Contract(USDC_ADDRESS, PoolAbi, provider.getSigner())
  
      if (!daiBalance) {
        daiPool.totalBalanceOf(address).then((balance) => {
          setDaiBalance(balance)
        })
      }

      withdrawUsdc = () => {
        usdcPool['withdraw()']()
      }

      withdrawDai = () => {
        daiPool['withdraw()']()
      }
      
      if (!usdcBalance) {
        usdcPool.totalBalanceOf(address).then((balance) => {
          setUsdcBalance(balance)
        })  
      }
    }
  }

  let content

  if (wallet) {
    content =
      <div>
        <div className=''>
          <h1>Dai Balance {ethers.utils.formatEther(daiBalance || '0')}</h1>
          <button className='button is-danger is-large' onClick={() => withdrawDai()}>Withdraw from Dai Daily Pool</button>
        </div>
        <br />
        <div>
          <h1>USDC Balance {ethers.utils.formatEther(usdcBalance || '0')}</h1>
          <button className='button is-danger is-large' onClick={() => withdrawUsdc()}>Withdraw from USDC Daily Pool</button>
        </div>
      </div>
      
  } else {
    content =
      <button className='button' onClick={() => connectWallet()}>Connect Wallet</button>
  }

  return (
    <>
      <section className="hero">
        <div className="hero-body">
          <div className="container is-fluid">
            <h1 className="title">
              Ripcord
            </h1>
            <h2 className="subtitle">
              PoolTogether Emergency Withdrawal
            </h2>
          </div>
        </div>
      </section>

      <section className='section'>
        <div className='container is-fluid'>
          {content}
        </div>
      </section>
    </>
  )
}
