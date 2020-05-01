import React from 'react'
import classnames from 'classnames'
import { omit } from 'lodash'
import { isBrowser } from 'react-device-detect'

export function Input(props) {
  let {
    autoFocus,
    marginClasses,
    handleChange,
    textClasses,
    roundedClasses,
    isError,
    value,
  } = props

  const defaultClasses = 'text-white font-headline border-2 border-transparent bg-purple-1100 rounded-full focus:outline-none focus:outline-none leading-none px-6 py-2 lg:py-2'

  if (roundedClasses === undefined) {
    roundedClasses = 'rounded'
  }

  if (marginClasses === undefined) {
    marginClasses = 'mb-2 lg:mb-2'
  }

  if (textClasses === undefined) {
    textClasses = 'text-sm sm:text-base lg:text-lg'
  }


  const className = classnames(
    defaultClasses,
    marginClasses,
    textClasses,
    roundedClasses,
    props.className, {
    'text-red-500': isError,
  }
  )

  const newProps = omit(props, [
    'marginClasses',
    'roundedClasses',
    'textClasses',
    'isError',
    'isLight'
  ])

  return <>
    <input
      {...newProps}
      autoFocus={autoFocus && isBrowser}
      // readOnly={this.props.readOnly}
      // onFocus={(e) => { this.setState({ inputFocused: true }) }}
      // onBlur={(e) => { this.setState({ inputFocused: false }) }}
      onChange={handleChange}
      value={value}
      className={classnames(
        className,
        'w-full lg:w-10/12 font-headline rounded-full focus:outline-none leading-none pl-6',
        'text-xl sm:text-2xl lg:text-3xl',
        'bg-transparent',
        {
          // 'text-red-400': this.props.inputHigherThanBalance,
          // 'text-white': !this.props.inputHigherThanBalance,
          // 'opacity-50': this.props.disabled
        }
      )}
    />

  </>
}