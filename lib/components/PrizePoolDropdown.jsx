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
  const { setPrizePool, setDepositToken, resetState } = props

  const { walletChainId } = useWalletNetwork()

  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider

  const [selectValue, setSelectValue] = useState()
  const [inputError, setInputError] = useState()

  const options = groupedOptions[walletChainId]

  useEffect(() => {
    handleClear()
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

  const _kickoffDeterminePrizePoolType = async (address, selectedOption) => {
    await determinePrizePoolType(address, selectedOption)
  }

  const handleInputChange = (newValue) => {
    if (!newValue) {
      return
    }

    const address = newValue.trim()
    setSelectValue({
      label: address,
      value: address
    })

    if (isValidAddress(address)) {
      setInputError(false)
      _kickoffDeterminePrizePoolType(address)
    }
  }

  const handleChange = (selectedOption, triggeredAction) => {
    if (triggeredAction.action === 'clear') {
      handleClear()
    }

    setSelectValue(selectedOption)

    if (selectedOption) {
      setInputError(false)
      const address = selectedOption.value
      _kickoffDeterminePrizePoolType(address, selectedOption)
    }
  }

  const handleBlur = async () => {
    if (!selectValue?.value) {
      return
    }

    if (isValidAddress(selectValue.value)) {
      setInputError(false)
    } else {
      setInputError(true)
      poolToast.error(
        'Please enter a valid Ethereum contract address or choose a deposit token from the list'
      )
    }
  }

  const handleClear = () => {
    resetState()
    setSelectValue(null)
    setInputError(false)
  }

  return (
    <SelectInputGroup
      id='prize-pool-type-dropdown'
      placeholder='Choose or enter deposit token ...'
      label={'Pool type'}
      options={options}
      handleInputChange={handleInputChange}
      handleChange={handleChange}
      handleBlur={handleBlur}
      handleClear={handleClear}
      inputError={inputError}
      value={selectValue}
    />
  )
}
