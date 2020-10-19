import React, { useState } from 'react'

import { DropdownInputGroup } from 'lib/components/DropdownInputGroup'

import AaveSvg from 'assets/images/aave.svg'
import CompoundSvg from 'assets/images/compound.svg'

export const YieldServiceDropdown = ({ onChange }) => {
  const [currentYieldService, setCurrentYieldService] = useState('aave')

  const yieldServices = {
    aave: {
      value: 'aave',
      label: (
        <>
          <img src={AaveSvg} className="inline-block w-6 sm:w-8 mr-3" />
          Aave
        </>
      )
    },
    compound: {
      value: 'compound',
      label: (
        <>
          <img src={CompoundSvg} className="inline-block w-6 sm:w-8 mr-3" />
          Compound
        </>
      )
    }
  }

  const onValueSet = (newYieldService) => {
    setCurrentYieldService(newYieldService)
    onChange(newYieldService)
  }

  const formatValue = (key) => {
    const yieldService = yieldServices[key]

    return <>{yieldService.label}</>
  }

  return (
    <>
      <DropdownInputGroup
        id="yield-service-dropdown"
        label={<>{yieldServices[currentYieldService].label}</>}
        formatValue={formatValue}
        onValueSet={onValueSet}
        current={currentYieldService}
        values={yieldServices}
      />
    </>
  )
}
