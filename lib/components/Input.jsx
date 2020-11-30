import React from 'react'
import classnames from 'classnames'
import { isBrowser } from 'react-device-detect'
import { DEFAULT_INPUT_CLASSES } from 'lib/constants'
import { omit } from 'lodash'

export function Input(props) {
  const {
    autoFocus,
    value,
    ...inputProps
  } = props

  return <input
    {...inputProps}
    autoFocus={autoFocus && isBrowser}
    value={value}
    className={DEFAULT_INPUT_CLASSES}
  />
}