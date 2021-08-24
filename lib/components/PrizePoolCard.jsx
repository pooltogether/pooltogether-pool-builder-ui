import React from 'react'

import { Card } from 'lib/components/Card'
import { CurrentNetworkInfo } from 'lib/components/CurrentNetworkInfo'
import { PrizePoolDropdown } from 'lib/components/PrizePoolDropdown'
import { InputLabel } from 'lib/components/InputLabel'
import { Tooltip } from 'lib/components/Tooltip'

export const PrizePoolCard = (props) => {
  return (
    <Card>
      <InputLabel primary='Deposit Token' secondary='Choose the token you want users to deposit'>
        <ul className='-mt-2 ml-6 mb-6 text-accent-1'>
          <li className='flex items-center flex-wrap'>
            1. Search for or select a token &amp; yield source from the list
          </li>
          <li className='flex items-center flex-wrap'>
            2. or paste an ERC20 token's contract address to create a{' '}
            <strong className='ml-1'>Stake</strong>{' '}
            <Tooltip
              id='stake-prize-pool-tooltip'
              className='inline-block text-default mx-1'
              tip='A “Stake Prize Pool” does not earn yield on deposited tokens and the prize must be added manually by the pool creator.'
            />{' '}
            prize pool
          </li>
          <li className='flex items-center flex-wrap'>
            3. or paste in a <strong className='ml-1'>Custom Yield Source</strong>{' '}
            <Tooltip
              id='yield-prize-pool-tooltip'
              className='inline-block text-default mx-1'
              tip='A “Yield Prize Pool” earns yield on deposited tokens which generate the prize.'
            />{' '}
            contract address
          </li>
        </ul>

        <PrizePoolDropdown {...props} />

        <div className='flex justify-end mt-2 text-right trans trans-fastest text-xs xs:text-sm sm:text-base'>
          <div className='w-auto xs:w-9/12 sm:w-7/12 opacity-80 hover:opacity-100'>
            <CurrentNetworkInfo justify='justify-end' />
          </div>
        </div>
      </InputLabel>
    </Card>
  )
}
