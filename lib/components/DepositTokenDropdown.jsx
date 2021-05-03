import React from 'react'

import { SelectInputGroup } from 'lib/components/SelectInputGroup'
import { useWalletNetwork } from 'lib/hooks/useWalletNetwork'

import { groupedOptions } from 'lib/data/depositTokenDropdownData'

export const DepositTokenDropdown = (props) => {
  const { depositToken, updateDepositToken } = props

  // const [depositToken, setDepositToken] = useState(depositToken)

  const { walletChainId } = useWalletNetwork()

  const options = groupedOptions[walletChainId]

  // const prizePools = {
  //   stake: {
  //     value: PRIZE_POOL_TYPE.stake,
  //     label: <>Stake Prize Pool</>
  //   },
  //   yield: {
  //     value: PRIZE_POOL_TYPE.yield,
  //     label: <>Yield Prize Pool (Custom Yield Source)</>
  //   }
  //   // compound: {

  //   // }
  // }

  // if (CONTRACT_ADDRESSES[walletChainId]?.COMPOUND) {
  //   prizePools.compound = {
  //     value: PRIZE_POOL_TYPE.compound,
  //     view: <>Yield Prize Pool (Compound Protocol)</>
  //   }
  // }

  const onValueSet = (newDepositToken) => {
    // setCurrentPrizePool(newPrizePool)
    updateDepositToken(newDepositToken)
  }

  // const formatValue = (key) => prizePools?.[key]?.label

  return (
    <SelectInputGroup
      id='deposit-token-dropdown'
      // theme={theme}
      placeholder='Choose or enter deposit token ...'
      label={'Pool type'}
      options={options}
      // formatValue={formatValue}
      // onValueSet={onValueSet}
      // current={currentPrizePool}
      // values={prizePools}
    />
  )
}
