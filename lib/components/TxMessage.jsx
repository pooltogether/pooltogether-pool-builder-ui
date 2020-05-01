import React, { Component } from 'react'

import { EtherscanTxLink } from 'lib/components/EtherscanTxLink'
import { LoadingDots } from 'lib/components/LoadingDots'
import { shortenAddress } from 'lib/utils/shortenAddress'

export const TxMessage =
    class _TxMessage extends Component {
      render() {
        const {
          tx,
          txType,
        } = this.props

        const txInWallet = tx.inWallet && !tx.sent
        const txSent = tx.sent && !tx.completed
        const txInFlight = (txInWallet || txSent)

        if (!tx) {
          return null
        }

        return <>
          {txInFlight && <>
            <div
              className='pt-10 sm:pt-3 pb-3 px-2 sm:px-20 lg:px-20 text-center text-white text-xs sm:text-sm lg:text-base'
            >
              <div
                className='font-bold rounded-full mb-2 text-white text-sm sm:text-base lg:text-lg uppercase px-2 py-1 bg-purple-900'
              >
                Transaction status
              </div>

              <div
                className='mb-2 text-white text-base sm:text-lg lg:text-xl'
              >
                {txType}
              </div>

              {txInWallet && <>
                <div
                  className='mb-1 text-orange-400 text-base'
                >
                  Please confirm the transaction in your wallet ...
                </div>
              </>}

              {txSent && <>
                <div
                  className='mb-1 text-orange-400 text-base'
                >
                  Waiting for confirmations ...
                </div>

                <div className='my-2'>
                  <LoadingDots />
                </div>
              </>}

              <div
                className='mt-4 uppercase text-lightPurple-600 text-sm sm:text-base'
              >
                {tx.hash && <>
                  {<EtherscanTxLink
                    chainId={42}
                    hash={tx.hash}
                  >
                    {shortenAddress(tx.hash)}
                  </EtherscanTxLink>}
                </>}
              </div>

              <div
                className='font-bold uppercase text-lightPurple-600 text-xs sm:text-sm lg:text-base'
              >
                {tx.hash && <>
                  Tx Hash
                </>}
              </div>



            </div>
          </>}

        </>

      }
    }