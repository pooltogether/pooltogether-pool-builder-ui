import React, { useContext } from 'react'

import { BlockExplorerLink } from 'lib/components/BlockExplorerLink'
import { LoadingDots } from 'lib/components/LoadingDots'
import { shorten } from 'lib/utils/shorten'
import { WalletContext } from 'lib/components/WalletContextProvider'

export const TxMessage = (props) => {
  const walletContext = useContext(WalletContext)
  const { _onboard } = walletContext || {}
  const chainId = _onboard.getState().appNetworkId

  const { tx, txType, resetButtonText, handleReset } = props

  const txInWallet = tx.inWallet && !tx.sent
  const txSent = tx.sent && !tx.completed
  const txCompleted = tx.completed
  const txError = tx.error
  const txInFlight = txInWallet || txSent || txCompleted

  if (!tx) {
    return null
  }

  return (
    <>
      {txInFlight && (
        <>
          <div className='bg-card rounded-lg px-2 sm:px-4 pt-5 pb-2 sm:py-6 text-center text-white text-xs sm:text-sm lg:text-base'>
            <div className='font-bold rounded-full text-default-soft text-sm sm:text-base uppercase px-2 bg-purple-1-900'>
              Transaction status
            </div>

            <div className='mb-4 text-white text-lg sm:text-xl lg:text-2xl'>{txType}</div>

            {txInWallet && (
              <>
                <div className='mb-1 text-yellow-1 text-base sm:text-lg lg:text-xl'>
                  Please confirm the transaction in your wallet ...
                </div>
              </>
            )}

            {txSent && (
              <>
                <div className='mt-6'>
                  <LoadingDots />
                </div>
                <div className='mb-1 text-yellow-1 text-base sm:text-lg lg:text-xl'>
                  Waiting for confirmations ...
                </div>
              </>
            )}

            {txCompleted && !txError && (
              <>
                <div className='mb-1 text-green-1 text-base sm:text-lg lg:text-xl'>
                  Transaction successful!
                </div>
              </>
            )}

            {txError && (
              <>
                <div className='mb-1 text-red-500 text-base sm:text-lg lg:text-xl'>
                  There was an error with the transaction
                </div>

                <div className='my-2 text-highlight-2'>
                  {tx && tx.hash ? (
                    <>
                      {
                        <BlockExplorerLink tx={tx.hash}>
                          See the result on Etherscan
                        </BlockExplorerLink>
                      }{' '}
                      or check the JS console.
                    </>
                  ) : (
                    <>Transaction Signature Denied</>
                  )}
                </div>
              </>
            )}

            <div className='mt-6 font-bold uppercase text-default-soft text-xs sm:text-sm lg:text-base'>
              {tx.hash && <>Tx Hash</>}
            </div>

            <div className='uppercase text-lightPurple-600 text-sm sm:text-base opacity-100 hover:opacity-70'>
              {tx.hash && (
                <>{<BlockExplorerLink tx={tx.hash}>{shorten(tx.hash)}</BlockExplorerLink>}</>
              )}
            </div>

            {handleReset && txCompleted && (
              <>
                <div className='mt-6 mb-2 text-center'>
                  <button
                    className='font-bold rounded-full text-green-1 border-2 sm:border-4 border-green-300 hover:text-white hover:bg-lightPurple-1000 text-sm sm:text-base pt-2 pb-2 px-6 trans'
                    onClick={handleReset}
                  >
                    {resetButtonText || 'Reset form'}
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  )
}
