import React, { useState } from 'react'

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

  const customStyles = {
    menu: (provided, state) => ({
      ...provided
      // width: state.selectProps.width,
      // borderBottom: '1px dotted pink',
      // color: state.selectProps.menuColor,
      // padding: 20
    }),

    control: (_, { selectProps: { width } }) => ({
      ..._,
      backgroundColor: 'green',
      width: width
    }),

    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1
      const transition = 'opacity 300ms'

      return { ...provided, opacity, transition }
    }
  }

  const dot = (color = '#ccc') => ({
    'alignItems': 'center',
    'display': 'flex',

    ':before': {
      backgroundColor: color,
      borderRadius: 10,
      content: '" "',
      display: 'block',
      marginRight: 8,
      height: 10,
      width: 10
    }
  })

  const colourStyles = {
    control: (styles, { isDisabled, isFocused, isSelected, isHovered }) => ({
      ...styles,
      borderColor: isDisabled
        ? 'black'
        : isSelected
        ? 'green'
        : isFocused
        ? 'orange'
        : isHovered
        ? 'red'
        : '',
      backgroundColor: '#290b5a',
      borderRadius: 100
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      const color = data.color
      // const color = chroma(data.color)
      return {
        ...styles,
        'backgroundColor': isDisabled ? null : isSelected ? data.color : isFocused,
        // ? color.alpha(0.1).css()
        // : null,
        'color': isDisabled ? '#ccc' : isSelected,
        // ? chroma.contrast(color, 'white') > 2
        //   ? 'white'
        //   : 'black'
        // : data.color,
        'cursor': isDisabled ? 'not-allowed' : 'default',

        ':active': {
          ...styles[':active'],
          backgroundColor: !isDisabled && (isSelected ? data.color : color)
        }
      }
    },
    input: (styles) => ({ ...styles, ...dot() }),
    placeholder: (styles) => ({ ...styles, ...dot() }),
    singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) })
  }

  // const theme = (theme) => ({
  //   ...theme,
  //   borderRadius: 100,
  //   colors: {
  //     ...theme.colors,
  //     primary25: 'hotpink',
  //     primary: 'black'
  //   }
  // })

  return (
    <SelectInputGroup
      id='deposit-token-dropdown'
      // theme={theme}
      styles={colourStyles}
      // placeHolder='Select the type of prize pool'
      label={'Pool type'}
      options={options}
      // formatValue={formatValue}
      // onValueSet={onValueSet}
      // current={currentPrizePool}
      // values={prizePools}
    />
  )
}
