import React, { useContext } from 'react'
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

  const { resultingContractAddresses } = props

  const { prizePool, prizeStrategy } = resultingContractAddresses

  const handleCopy = () => {
    poolToast.success(`Copied to clipboard!`)
  }

  return (
    <>
      <div className='text-center text-default'>
        <div className='font-bold mb-4 py-2 text-lg sm:text-2xl lg:text-3xl'>
          Contracts deployed!
        </div>

        <div
          className='-mx-6 sm:mx-0 px-6 sm:px-6 py-3 relative mb-4 bg-card-selected rounded-lg'
          style={{
            minHeight: 60
          }}
        >
          <span className='text-purple-300 block text-xs sm:text-base'>
            New Prize Pool's contract address:
          </span>
          <div className='absolute t-0 r-0 pr-3 pt-3 mr-3 sm:mr-0'>
            <CopyToClipboard text={prizePool} onCopy={handleCopy}>
              <a
                className='flex flex-col items-center justify-center cursor-pointer stroke-current  hover:text-blue rounded-full bg-lightPurple-1000 w-6 h-6 block'
                title='Copy to clipboard'
              >
                <FeatherIcon icon='copy' className='w-3 h-3' />
              </a>
            </CopyToClipboard>
          </div>
          <span className='text-white font-mono text-xs sm:text-xl'>{prizePool}</span>
        </div>

        <div
          className='-mx-6 sm:mx-0 px-6 sm:px-6 py-3 relative mb-4 bg-card-selected rounded-lg'
          style={{
            minHeight: 60
          }}
        >
          <span className='text-purple-300 block text-xs sm:text-base'>
            New Prize Strategy contract address:
          </span>
          <div className='absolute t-0 r-0 pr-3 pt-3 mr-3 sm:mr-0'>
            <CopyToClipboard text={prizeStrategy} onCopy={handleCopy}>
              <a
                className='flex flex-col items-center justify-center cursor-pointer stroke-current  hover:text-blue rounded-full bg-lightPurple-1000 w-6 h-6 block'
                title='Copy to clipboard'
              >
                <FeatherIcon icon='copy' className='w-3 h-3' />
              </a>
            </CopyToClipboard>
          </div>
          <span className='text-white font-mono text-xs sm:text-xl'>{prizeStrategy}</span>
        </div>

        <div className='relative mt-10 rounded-lg pb-3'>
          <Button
            color='green'
            className='w-full sm:w-2/3 sm:ml-auto'
            backgroundColorClasses='bg-green hover:bg-highlight-4 active:bg-highlight-5'
            onClick={(e) => {
              e.preventDefault()
              const host = location.host.match('staging')
                ? 'community-staging.pooltogether.com'
                : 'community.pooltogether.com'
              window.location.href = `https://${host}/pools/${networkName}/${prizePool}`
            }}
          >
            View pool in Community UI
          </Button>
        </div>
      </div>
    </>
  )
}
