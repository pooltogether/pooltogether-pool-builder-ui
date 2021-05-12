import React, { useContext, useEffect, useState } from 'react'
import { isValidAddress } from '@pooltogether/utilities'

import { PRIZE_POOL_TYPE } from 'lib/constants'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { SelectInputGroup } from 'lib/components/SelectInputGroup'
import { groupedOptions, knownCustomYieldSourceAddresses } from 'lib/data/prizePoolDropdownData'
import { useWalletNetwork } from 'lib/hooks/useWalletNetwork'
import { fetchPrizePoolType } from 'lib/utils/fetchPrizePoolType'
import { poolToast } from 'lib/utils/poolToast'

export const PrizePoolDropdown = (props) => {
  const { setPrizePool, setDepositToken } = props

  const { walletChainId } = useWalletNetwork()

  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider

  const [selectValue, setSelectValue] = useState()

  const options = groupedOptions[walletChainId]

  useEffect(() => {
    clear()
  }, [walletChainId])

  const determinePrizePoolType = async (address, selectedOption = null) => {
    setPrizePool({})

    const { prizePoolType, depositToken } = await fetchPrizePoolType(provider, address)

    if (prizePoolType === PRIZE_POOL_TYPE.error) {
      poolToast.error(`Invalid Staking Token or Custom Yield Source entered`)
    }

    setDepositToken(depositToken)

    const prizePool = {
      type: prizePoolType,
      yieldProtocol: selectedOption
    }

    // Aave is considered a Custom Yield Source but we want to treat it differently at
    // the display layer for a better experience
    if (knownCustomYieldSourceAddresses[walletChainId]?.includes(address.toLowerCase())) {
      prizePool.knownYieldSource = true
    }

    setPrizePool(prizePool)
  }

  const handleInputChange = (newValue) => {
    if (!newValue) {
      return
    }

    const address = newValue.trim()
    setSelectValue({
      value: address
    })

    if (isValidAddress(address)) {
      const _kickoffDeterminePrizePoolType = async () => {
        await determinePrizePoolType(address)
      }
      _kickoffDeterminePrizePoolType(address)
    }
  }

  const handleChange = async (selectedOption) => {
    setSelectValue(selectedOption)

    if (selectedOption) {
      const address = selectedOption.value
      await determinePrizePoolType(address, selectedOption)
    }
  }

  const clear = () => {
    setSelectValue(null)
  }

  console.log(selectValue)

  return (
    <SelectInputGroup
      id='prize-pool-type-dropdown'
      placeholder='Choose or enter deposit token ...'
      label={'Pool type'}
      options={options}
      handleInputChange={handleInputChange}
      handleChange={handleChange}
      value={selectValue}
    />
  )
}
