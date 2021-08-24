import React from 'react'
import classnames from 'classnames'
import FeatherIcon from 'feather-icons-react'
import { getChain } from '@pooltogether/evm-chains-extended'
import { useOnboard } from '@pooltogether/hooks'

import { BlockExplorerLink } from 'lib/components/BlockExplorerLink'
import { NetworkIcon } from 'lib/components/NetworkIcon'
import { useEnsName } from 'lib/hooks/useEnsName'
import { networkColorClassname } from 'lib/utils/networks'
import { shorten } from 'lib/utils/shorten'

export const WalletInfo = () => {
  const { address, walletName, network, disconnectWallet } = useOnboard()

  let chainId = 1

  if (network) {
    chainId = network
  }

  const { shortenedEnsName } = useEnsName(address)

  let innerContent = null
  let networkNameJsx = null

  if (chainId) {
    let network = {}
    let networkName = 'unknown network'
    try {
      network = getChain(chainId)
      networkName = network.name || network.network
    } catch (error) {
      // console.warn(error)
    }

    networkNameJsx = (
      <span className={classnames(networkColorClassname(chainId), 'inline-block')}>
        {networkName}
      </span>
    )
  }

  if (address && walletName) {
    innerContent = (
      <>
        <div className='flex flex-row justify-end my-auto items-center leading-none'>
          <span className='text-highlight-3 hover:text-highlight-1 overflow-ellipsis block mx-1'>
            <BlockExplorerLink address={address}>
              {shortenedEnsName ? shortenedEnsName : shorten(address)}
            </BlockExplorerLink>
          </span>

          <span className='flex items-center text-default mx-1'>{walletName}</span>

          <span className='w-6 mx-1'>
            <NetworkIcon chainId={chainId} />
          </span>
          <span className='ml-1'>{networkNameJsx}</span>
        </div>

        <button
          onClick={() => disconnectWallet()}
          className={classnames(
            'text-lightPurple-500 hover:text-white trans ml-2 outline-none focus:outline-none',
            'block border rounded-full w-6 h-6 text-center text-lg',
            'border-purple-700 hover:bg-lightPurple-700',
            'trans'
          )}
        >
          <FeatherIcon icon='x' className={classnames('w-4 h-4 hover:text-white m-auto')} />
        </button>
      </>
    )
  }

  return (
    <>
      <div className='relative flex justify-end items-center'>{innerContent}</div>
    </>
  )
}
