import React, { useContext } from 'react'
// import { useRouter } from 'next/router'
import CopyToClipboard from 'react-copy-to-clipboard'
import FeatherIcon from 'feather-icons-react'

import { Button } from 'lib/components/Button'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { chainIdToName } from 'lib/utils/chainIdToName'
import { poolToast } from 'lib/utils/poolToast'

export const BuilderResultPanel = (props) => {
  const walletContext = useContext(WalletContext)
  const currentState = walletContext._onboard.getState()
  
  let chainId = 1
  if (currentState) {
    chainId = currentState.appNetworkId
  }
  const networkName = chainIdToName(chainId)

  const {
    resultingContractAddresses,
  } = props

  const {
    yieldService,
    moduleManager,
    prizeStrategy,
    sponsorship,
    timelock,
    ticket,
  } = resultingContractAddresses

  const handleCopy = () => {
    poolToast.success(`Copied to clipboard!`)
  }

  return <>
    <div
      className='font-bold mb-8 py-2 text-lg sm:text-xl lg:text-2xl'
    >
      Contracts deployed:
    </div>

    <div
      className='relative mb-4 rounded-lg py-3 lg:w-9/12'
      style={{
        minHeight: 60
      }}
    >
      <Button
        color='green'
        paddingClasses='px-5 py-2 sm:py-3 lg:py-4'
        onClick={(e) => {
          e.preventDefault()
          window.location.href = `https://reference-app.pooltogether.com/pools/${networkName}/${moduleManager}`
        }}
      >
        Open pool in reference app
      </Button>
    </div>

    <div
      className='-mx-6 sm:mx-0 px-6 sm:px-6 py-3 relative mb-4 bg-purple-1300 rounded-lg lg:w-9/12'
      style={{
        minHeight: 60
      }}
    >
      <span
        className='text-purple-300 block text-xs sm:text-base'
      >New Prize Pool's Module Manager contract address:</span>
      <div className='absolute t-0 r-0 pr-3 pt-3 mr-3 sm:mr-0'>
        <CopyToClipboard
          text={moduleManager}
          onCopy={handleCopy}
        >
          <a
            className='flex flex-col items-center justify-center cursor-pointer stroke-current text-blue-300 hover:text-blue-100 rounded-full bg-lightPurple-1000 w-6 h-6 block'
            title='Copy to clipboard'
          >
            <FeatherIcon
              icon='copy'
              className='w-4 h-4'
            />
          </a>
        </CopyToClipboard>
      </div>
      <span
        className='text-white font-mono text-xs sm:text-xl'
      >{moduleManager}</span>
    </div>

    <hr />
    <hr />

    <div
      className='-mx-6 sm:mx-0 px-6 sm:px-6 py-3 relative mb-4 bg-purple-1300 rounded-lg lg:w-9/12'
      style={{
        minHeight: 60
      }}
    >
      <span
        className='text-purple-300 block text-xs sm:text-base'
      >Yield Service contract address: </span>
      <div className='absolute t-0 r-0 pr-3 pt-3 mr-3 sm:mr-0'>
        <CopyToClipboard
          text={yieldService}
          onCopy={handleCopy}
        >
          <a
            className='flex flex-col items-center justify-center cursor-pointer stroke-current text-blue-300 hover:text-blue-100 rounded-full bg-lightPurple-1000 w-6 h-6 block'
            title='Copy to clipboard'
          >
            <FeatherIcon
              icon='copy'
              className='w-4 h-4'
            />
          </a>
        </CopyToClipboard>
      </div>
      <span
        className='text-white font-mono text-xs sm:text-xl'
      >{yieldService}</span>
    </div>
    
    <div
      className='-mx-6 sm:mx-0 px-6 sm:px-6 py-3 relative mb-4 bg-purple-1300 rounded-lg lg:w-9/12'
      style={{
        minHeight: 60
      }}
    >
      <span
        className='text-purple-300 block text-xs sm:text-base'
      >Prize Strategy contract address: </span>
      <div className='absolute t-0 r-0 pr-3 pt-3 mr-3 sm:mr-0'>
        <CopyToClipboard
          text={prizeStrategy}
          onCopy={handleCopy}
        >
          <a
            className='flex flex-col items-center justify-center cursor-pointer stroke-current text-blue-300 hover:text-blue-100 rounded-full bg-lightPurple-1000 w-6 h-6 block'
            title='Copy to clipboard'
          >
            <FeatherIcon
              icon='copy'
              className='w-4 h-4'
            />
          </a>
        </CopyToClipboard>
      </div>
      <span
        className='text-white font-mono text-xs sm:text-xl'
      >{prizeStrategy}</span>
    </div>

    
    
    {/* <div
      className='-mx-6 sm:mx-0 px-6 sm:px-6 py-3 relative mb-4 bg-purple-1300 rounded-lg lg:w-9/12'
      style={{
        minHeight: 60
      }}
    >
      <span
        className='text-purple-300 block text-xs sm:text-base'
      >Sponsorship contract address: </span>
      <div className='absolute t-0 r-0 pr-3 pt-3 mr-3 sm:mr-0'>
        <CopyToClipboard
          text={sponsorship}
          onCopy={handleCopy}
        >
          <a
            className='flex flex-col items-center justify-center cursor-pointer stroke-current text-blue-300 hover:text-blue-100 rounded-full bg-lightPurple-1000 w-6 h-6 block'
            title='Copy to clipboard'
          >
            <FeatherIcon
              icon='copy'
              className='w-4 h-4'
            />
          </a>
        </CopyToClipboard>
      </div>
      <span
        className='text-white font-mono text-xs sm:text-xl'
      >{collateral}</span>
    </div> */}


    <div
      className='-mx-6 sm:mx-0 px-6 sm:px-6 py-3 relative mb-4 bg-purple-1300 rounded-lg lg:w-9/12'
      style={{
        minHeight: 60
      }}
    >
      <span
        className='text-purple-300 block text-xs sm:text-base'
      >Sponsorship contract address: </span>
      <div className='absolute t-0 r-0 pr-3 pt-3 mr-3 sm:mr-0'>
        <CopyToClipboard
          text={sponsorship}
          onCopy={handleCopy}
        >
          <a
            className='flex flex-col items-center justify-center cursor-pointer stroke-current text-blue-300 hover:text-blue-100 rounded-full bg-lightPurple-1000 w-6 h-6 block'
            title='Copy to clipboard'
          >
            <FeatherIcon
              icon='copy'
              className='w-4 h-4'
            />
          </a>
        </CopyToClipboard>
      </div>
      <span
        className='text-white font-mono text-xs sm:text-xl'
      >{sponsorship}</span>
    </div>

    <div
      className='-mx-6 sm:mx-0 px-6 sm:px-6 py-3 relative mb-4 bg-purple-1300 rounded-lg lg:w-9/12'
      style={{
        minHeight: 60
      }}
    >
      <span
        className='text-purple-300 block text-xs sm:text-base'
      >Timelock contract address: </span>
      <div className='absolute t-0 r-0 pr-3 pt-3 mr-3 sm:mr-0'>
        <CopyToClipboard
          text={timelock}
          onCopy={handleCopy}
        >
          <a
            className='flex flex-col items-center justify-center cursor-pointer stroke-current text-blue-300 hover:text-blue-100 rounded-full bg-lightPurple-1000 w-6 h-6 block'
            title='Copy to clipboard'
          >
            <FeatherIcon
              icon='copy'
              className='w-4 h-4'
            />
          </a>
        </CopyToClipboard>
      </div>
      <span
        className='text-white font-mono text-xs sm:text-xl'
      >{timelock}</span>
    </div>

    <div
      className='-mx-6 sm:mx-0 px-6 sm:px-6 py-3 relative mb-4 bg-purple-1300 rounded-lg lg:w-9/12'
      style={{
        minHeight: 60
      }}
    >
      <span
        className='text-purple-300 block text-xs sm:text-base'
      >Ticket contract address: </span>
      <div className='absolute t-0 r-0 pr-3 pt-3 mr-3 sm:mr-0'>
        <CopyToClipboard
          text={ticket}
          onCopy={handleCopy}
        >
          <a
            className='flex flex-col items-center justify-center cursor-pointer stroke-current text-blue-300 hover:text-blue-100 rounded-full bg-lightPurple-1000 w-6 h-6 block'
            title='Copy to clipboard'
          >
            <FeatherIcon
              icon='copy'
              className='w-4 h-4'
            />
          </a>
        </CopyToClipboard>
      </div>
      <span
        className='text-white font-mono text-xs sm:text-xl'
      >{ticket}</span>
    </div>
  </>
}

