import React from 'react'

import { Card } from 'lib/components/Card'
import { CurrentNetworkInfo } from 'lib/components/CurrentNetworkInfo'
import { InputLabel } from 'lib/components/InputLabel'
import { DepositTokenDropdown } from 'lib/components/DepositTokenDropdown'

export const PrizePoolTypeCard = (props) => {
  return (
    <Card>
      <InputLabel primary='Deposit Token' secondary='Choose the token you want users to deposit'>
        <ul className='-mt-2 ml-6 mb-6 text-accent-1'>
          <li>1. Search for or select a token &amp; yield source from the list</li>
          <li>2. or, Paste an ERC20 token's contract address to create a staked prize pool</li>
          <li>3. or, Paste a Custom Yield Source contract address</li>
        </ul>
        <p>
          A “Yield Prize Pool” earns yield on deposited tokens which generate the prize. A “Stake
          Prize Pool” does not earn yield on deposited tokens and the prize must be added manually
          by the pool creator.
        </p>
        <DepositTokenDropdown {...props} />
        <div className='flex justify-end mt-2 text-right trans trans-fastest text-xs xs:text-sm sm:text-base'>
          <div className='w-auto xs:w-9/12 sm:w-7/12 opacity-50 hover:opacity-100'>
            <CurrentNetworkInfo justify='justify-end' />
          </div>
        </div>
      </InputLabel>
    </Card>
  )
}
