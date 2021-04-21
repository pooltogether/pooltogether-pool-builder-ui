import React, { useState } from 'react'
import Select from 'react-select'
// import { Menu, MenuButton, MenuItem, MenuItems, MenuPopover } from '@reach/menu-button'
import classnames from 'classnames'

import { DEFAULT_INPUT_GROUP_CLASSES, DEFAULT_INPUT_LABEL_CLASSES } from 'lib/constants'

export const SelectInputGroup = (props) => {
  const { options } = props
  // const { id, formatOption, label, placeHolder, options, current, onOptionSet, disabled } = props

  // const [currentOption, setCurrentOption] = useState(current ? current : '')

  // const handleChangeOption = (newOption) => {
  //   setCurrentOption(newOption)
  //   onOptionSet(newOption)
  // }

  // let optionsArray = []
  // if (typeof options === 'object') {
  //   optionsArray = Object.keys(options).map((v) => v)
  // }

  // const menuItems = optionsArray.map((optionItem) => {
  //   let option = optionItem

  //   const selected = option === currentOption

  //   return (
  //     <MenuItem
  //       key={`${id}-option-picker-item-${option}`}
  //       onSelect={() => {
  //         handleChangeOption(option)
  //       }}
  //       className={classnames({
  //         selected
  //       })}
  //     >
  //       {formatOption ? formatOption(option) : option}
  //     </MenuItem>
  //   )
  // })

  // Styling

  // let {
  //   textClasses,
  //   roundedClasses,
  //   marginClasses,
  //   borderClasses,
  //   backgroundClasses,
  //   labelClassName,
  //   unitsClassName,
  //   containerClassName,
  //   isError,
  //   isSuccess
  // } = props

  // textClasses = textClasses
  //   ? textClasses
  //   : classnames('text-xs xs:text-sm sm:text-xl lg:text-2xl trans', {
  //       'text-whitesmoke': disabled || !currentOption
  //     })

  // containerClassName = containerClassName ? containerClassName : 'w-full'

  // roundedClasses = roundedClasses ? roundedClasses : 'rounded-full'

  // marginClasses = marginClasses ? marginClasses : 'mb-2 lg:mb-2'

  // borderClasses = borderClasses
  //   ? borderClasses
  //   : classnames('border', {
  //       'border-red': isError,
  //       'border-green-2': isSuccess,
  //       'border-transparent': !isError && !isSuccess,
  //       'hover:border-accent-3 focus-within:border-accent-3 focus-within:shadow-green': !disabled
  //     })

  // backgroundClasses = backgroundClasses
  //   ? backgroundClasses
  //   : classnames(backgroundClasses, {
  //       'bg-grey': disabled
  //     })

  // labelClassName = labelClassName
  //   ? labelClassName
  //   : classnames(DEFAULT_INPUT_LABEL_CLASSES, {
  //       'cursor-not-allowed font-whitesmoke': disabled,
  //       'text-accent-1': !disabled
  //     })

  // unitsClassName = unitsClassName
  //   ? unitsClassName
  //   : classnames('font-bold text-xs sm:text-sm whitespace-no-wrap', {
  //       'cursor-not-allowed font-whitesmoke': disabled,
  //       'font-white': !disabled
  //     })

  // const className = classnames(
  //   DEFAULT_INPUT_GROUP_CLASSES,
  //   containerClassName,
  //   textClasses,
  //   roundedClasses,
  //   marginClasses,
  //   borderClasses,
  //   backgroundClasses
  // )

  // let selectedItem = placeHolder ? placeHolder : null
  // if (currentOption) {
  //   selectedItem = formatOption ? formatOption(currentOption) : currentOption
  // }

  return <Select options={options} />

  // return (
  //   <>
  //     <Menu id={id}>
  //       {({ isExpanded }) => (
  //         <>
  //           <MenuButton className={classnames(className, 'focus:outline-none')}>
  //             <div className='flex flex-col text-left'>
  //               <label htmlFor={id} className={labelClassName}>
  //                 {label}
  //               </label>
  //               <div className='w-full flex justify-between'>
  //                 <div className='flex'>{selectedItem}</div>
  //                 <FeatherIcon
  //                   icon={isExpanded ? 'chevron-up' : 'chevron-down'}
  //                   className='relative w-4 h-4 sm:w-8 sm:h-8 inline-block my-auto'
  //                   strokeWidth='0.15rem'
  //                 />
  //               </div>
  //             </div>
  //           </MenuButton>

  //           <MenuPopover position={positionMatchWidth}>
  //             <MenuItems>{menuItems}</MenuItems>
  //           </MenuPopover>
  //         </>
  //       )}
  //     </Menu>
  //   </>
  // )
}
