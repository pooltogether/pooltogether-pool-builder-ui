import React from 'react'

import { Card } from 'lib/components/Card'
import { CurrentNetworkInfo } from 'lib/components/CurrentNetworkInfo'
import { InputLabel } from 'lib/components/InputLabel'
import { DepositTokenDropdown } from 'lib/components/DepositTokenDropdown'

export const DepositTokenCard = (props) => {
  return (
    <Card>
      <InputLabel
        primary='Deposit Token'
        description={`Choose the token you want users to deposit, paste an ERC20 token's contract address to create a stake pool, or paste a Custom Yield Source contract address:`}
      >
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
