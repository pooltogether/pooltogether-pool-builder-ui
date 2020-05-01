import React, { PureComponent } from 'react'
import FeatherIcon from 'feather-icons-react'

import { formatEtherscanTxUrl } from 'lib/utils/formatEtherscanTxUrl'

export const EtherscanTxLink = 
  class _EtherscanTxLink extends PureComponent {
    render () {
      const {
        children,
        className,
        hash,
        chainId,
      } = this.props

      const url = formatEtherscanTxUrl(hash, chainId)

      return (
        <>
          <a
            href={url}
            className={`no-underline ${className}`}
            target='_blank'
            rel='noopener noreferrer'
            title='View on Etherscan'
          >
            {children} <FeatherIcon
              icon='external-link'
              className='is-etherscan-arrow inline-block'
            />
          </a>
        </>
      )
    }
    
  }