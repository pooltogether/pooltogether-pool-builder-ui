import React, { useContext, useEffect, useState } from 'react'
import {
  getKnownYieldSourceContract,
  reactSelectGroupedOptions,
  isValidAddress
} from '@pooltogether/utilities'

import { WalletContext } from 'lib/components/WalletContextProvider'
import { SelectInputGroup } from 'lib/components/SelectInputGroup'
import { useWalletNetwork } from 'lib/hooks/useWalletNetwork'
import { fetchPrizePoolType } from 'lib/utils/fetchPrizePoolType'
import { poolToast } from 'lib/utils/poolToast'

export const PrizePoolDropdown = (props) => {
  const {
    errorDeterminingPrizePoolType,
    setErrorDeterminingPrizePoolType,
    setLoadingPrizePoolData,
    setPrizePool,
    setDepositToken,
    resetState
  } = props

  const { walletChainId } = useWalletNetwork()

  const walletContext = useContext(WalletContext)
  const provider = walletContext.state.provider

  const [selectValue, setSelectValue] = useState()
  const [inputError, setInputError] = useState()

  const options = reactSelectGroupedOptions[walletChainId]

  useEffect(() => {
    handleClear()
  }, [walletChainId])

  const determinePrizePoolType = async (address, selectedOption = null) => {
    setPrizePool({})

    const { prizePoolType, depositToken, error } = await fetchPrizePoolType(provider, address)

    if (error) {
      setErrorDeterminingPrizePoolType(true)
      poolToast.error(`Invalid Staking Token address or Custom Yield Source address entered`)
    }

    setDepositToken(depositToken)

    const prizePool = {
      type: prizePoolType,
      yieldProtocol: selectedOption
    }

    // Aave is considered a Custom Yield Source but we want to treat it differently at
    // the display layer for a better experience
    const contract = getKnownYieldSourceContract(walletChainId, address)
    if (contract?.yieldSourceName === 'Aave') {
      prizePool.knownYieldSource = true
    }

    setPrizePool(prizePool)
  }

  const _kickoffDeterminePrizePoolType = async (address, selectedOption) => {
    setLoadingPrizePoolData(true)
    await determinePrizePoolType(address, selectedOption)
    setLoadingPrizePoolData(false)
  }

  const handleChange = (newValue, triggeredAction) => {
    if (triggeredAction.action === 'clear') {
      handleClear()
    }

    setErrorDeterminingPrizePoolType(false)
    setInputError(false)
    setSelectValue(newValue)

    if (newValue) {
      const address = newValue.value.trim()

      // CREATABLE API, when user enters a custom ETH address
      if (newValue.__isNew__) {
        newValue.label = address
        newValue.value = address
        setSelectValue(newValue)
      }

      if (isValidAddress(address)) {
        setInputError(false)
        _kickoffDeterminePrizePoolType(address, newValue)
      } else {
        setInputError(true)
        poolToast.error(
          'Please enter a valid Ethereum contract address or choose a deposit token from the list'
        )
      }
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
      handleChange={handleChange}
      handleClear={handleClear}
      error={inputError || errorDeterminingPrizePoolType}
      value={selectValue}
    />
  )
}
