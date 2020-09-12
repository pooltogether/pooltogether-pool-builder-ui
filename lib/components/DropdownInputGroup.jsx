import React, { useState } from 'react'
import classnames from 'classnames'
import FeatherIcon from 'feather-icons-react'
import {
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
} from '@reach/menu-button'

export const DropdownInputGroup = (props) => {
  const {
    id,
    formatValue,
    label,
    values,
    current,
    onValueSet
  } = props

  const [currentValue, setCurrentValue] = useState(current ? current : '')

  const handleChangeValueClick = (newValue) => {
    setCurrentValue(newValue)
    onValueSet(newValue)
  }

  let valuesArray = []
  if (typeof values === 'object') {
    valuesArray = Object.keys(values).map(v => v)
  }

  const menuItems = valuesArray.map(valueItem => {
    let value = valueItem

    const selected = value === currentValue

    return <MenuItem
      key={`${id}-value-picker-item-${value}`}
      onSelect={() => { handleChangeValueClick(value) }}
      className={classnames(
        {
          selected
        }
      )}
    >
      {formatValue ? formatValue(value) : value}
    </MenuItem>
  })

  return <>
    <Menu>
      {({ isExpanded }) => (
        <>
          <MenuButton
            className={classnames(
              'inline-flex items-center justify-center trans text-white font-headline',
              'border-2 border-transparent bg-card-selected hover:bg-purple active:bg-purple focus:bg-purple',
              'trans rounded-full focus:outline-none focus:outline-none leading-none px-6 py-4 lg:py-4 mb-6',
              'text-sm sm:text-base lg:text-2xl',
              {
                'text-highlight-2': !isExpanded,
                'text-highlight-1': isExpanded,
              }
            )}
          >
            {label ? label : currentValue} <FeatherIcon
              icon={isExpanded ? 'chevron-up' : 'chevron-down'}
              className='relative w-4 h-4 inline-block ml-2'
              strokeWidth='0.15rem'
            />
          </MenuButton>

          <MenuList>
            {menuItems}
          </MenuList>
        </>
      )}
    </Menu>

  </>
}