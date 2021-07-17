import React, { useRef, useEffect } from 'react'
import classnames from 'classnames'
import { omit } from 'lodash'
import Link from 'next/link'

const COLOR_CLASSES = {
  primary: {
    backgroundClasses: 'bg-green-400 hover:bg-opacity-80',
    borderClasses: 'border border-green-1 active:shadow-green focus:shadow-green',
    textColorClasses: 'text-green-1'
  },
  secondary: {
    backgroundClasses: 'bg-green-400 bg-opacity-0 hover:bg-opacity-15 active:bg-opacity-15',
    borderClasses: 'border border-green-1 active:shadow-green focus:shadow-green',
    textColorClasses: 'text-highlight-2'
  },
  tertiary: {
    backgroundClasses:
      'bg-green-400 bg-opacity-0 hover:bg-opacity-15 focus:bg-opacity-15 active:bg-opacity-15',
    borderClasses: 'border border-transparent',
    textColorClasses: 'text-highlight-2 underline hover:no-underline active:no-underline'
  },
  danger: {
    backgroundClasses: 'bg-transparent',
    borderClasses:
      'border border-red-600 hover:border-red-700 focus:border-red-700 active:shadow-red',
    textColorClasses:
      'text-red-600 hover:text-red-700 focus:text-red-700 active:shadow-red focus:shadow-red'
  },
  warning: {
    backgroundClasses: 'bg-transparent',
    borderClasses:
      'border border-orange-500 hover:border-orange-600 focus:border-orange-600 active:shadow-orange',
    textColorClasses:
      'text-orange-500 hover:text-orange-600 focus:text-orange-600 active:shadow-orange focus:shadow-orange'
  },
  text_warning: {
    backgroundClasses:
      'bg-orange-500 bg-opacity-0 hover:bg-opacity-15 focus:bg-opacity-15 active:bg-opacity-15',
    borderClasses: 'border border-transparent',
    textColorClasses: 'text-orange-500 underline hover:no-underline active:no-underline'
  },
  disabled: {
    backgroundClasses: 'bg-transparent',
    borderClasses: 'border border-gray-400 focus:border-gray-400',
    textColorClasses: 'text-gray-400 focus:shadow-gray'
  }
}

const getBackgroundColorClasses = (bgColorClasses) => {
  if (bgColorClasses) {
    return bgColorClasses
  }

  return 'bg-blue-1 hover:bg-highlight-1 active:bg-highlight-1'
}

const getBorderClasses = (borderClasses, color, isText) => {
  if (borderClasses) {
    return borderClasses
  }

  if (isText) {
    return 'border-transparent'
  }

  return `border-0`
}

const getColorClasses = (color, disabled) => {
  if (disabled) {
    return COLOR_CLASSES.disabled
  }

  switch (color) {
    case 'primary': {
      return COLOR_CLASSES.primary
    }
    case 'secondary': {
      return COLOR_CLASSES.secondary
    }
    case 'tertiary': {
      return COLOR_CLASSES.tertiary
    }
    case 'danger': {
      return COLOR_CLASSES.danger
    }
    case 'warning': {
      return COLOR_CLASSES.warning
    }
    case 'text_warning': {
      return COLOR_CLASSES.text_warning
    }
    default: {
      return COLOR_CLASSES.primary
    }
  }
}

const getPaddingClasses = (paddingClasses, isText) => {
  if (paddingClasses) {
    return paddingClasses
  }

  if (isText) {
    return 'px-1 py-1'
  }

  return 'px-1 py-2 sm:py-3 lg:py-4'
}

const getTextColorClasses = (textColorClasses, color) => {
  if (textColorClasses) {
    return textColorClasses
  }

  switch (color) {
    case 'white':
      return 'text-black hover:text-black focus:text-black active:text-black'
    case 'green':
      return 'text-primary hover:text-primary-soft focus:text-primary-soft active:text-highlight-1'
    default:
      return 'text-white hover:text-white focus:text-white active:text-white'
  }
}

const getTextSizeClasses = (textSizeClasses, isText, size) => {
  if (textSizeClasses) {
    return textSizeClasses
  }

  if (isText) {
    return `text-sm sm:text-base lg:text-2xl`
  }

  if (!size) {
    size = 'base'
  }

  switch (size) {
    case 'xs':
      return `text-xs sm:text-sm lg:text-base`
    case 'sm':
      return `text-sm sm:text-base lg:text-lg`
    case 'lg':
      return `text-lg sm:text-xl lg:text-2xl`
    case 'xl':
      return `text-xl sm:text-2xl lg:text-3xl`
    case '2xl':
      return `text-2xl sm:text-3xl lg:text-4xl`
    default:
      return `text-base sm:text-lg lg:text-xl`
  }
}

const getTransitionClasses = (transitionClasses) => {
  return transitionClasses || 'trans trans-fast'
}

const getRoundedClasses = (roundedClasses) => {
  return roundedClasses || 'rounded-full'
}

export const Button = (props) => {
  // create a ref to store the textInput DOM element
  const buttonRef = useRef()

  useEffect(() => {
    const el = buttonRef.current

    el.addEventListener(
      'click',
      (e) => {
        const previousCssText = el.style.cssText

        e = e.touches ? e.touches[0] : e

        const r = el.getBoundingClientRect(),
          d = Math.sqrt(Math.pow(r.width, 2) + Math.pow(r.height, 2)) * 2

        el.style.cssText = `--s: 0; --o: 1;`

        // I believe this allow the CPU to tick w/ the new cssText set above
        // before setting it to the new values
        el.offsetTop

        el.style.cssText = `${previousCssText} --t: 1; --o: 0; --d: ${d}; --x:${
          e.clientX - r.left
        }; --y:${e.clientY - r.top};`
      },
      [buttonRef]
    )
  })

  let {
    backgroundColorClasses,
    // borderClasses,
    children,
    color,
    className,
    disabled,
    href,
    as,
    noAnim,
    isBold,
    isText,
    isLowOpacity,
    paddingClasses,
    roundedClasses,
    size,
    // textColorClasses,
    textSizeClasses,
    transitionClasses
  } = props

  let defaultClasses =
    'pt-button inline-block text-center leading-snug tracking-wide cursor-pointer outline-none focus:outline-none active:outline-none no-underline'

  if (isBold !== false) {
    defaultClasses += ' font-bold'
  }

  if (isLowOpacity) {
    defaultClasses += ' opacity-50 hover:opacity-100'
  }

  if (isText) {
    // colorClass = `text-${color}-300`
    // defaultClasses += ' mx-auto min-width-auto'
    defaultClasses += ' min-width-auto'
  }

  const { backgroundClasses, borderClasses, textColorClasses } = getColorClasses(color, disabled)
  // backgroundColorClasses = getBackgroundColorClasses(backgroundColorClasses)
  // borderClasses = getBorderClasses(borderClasses, color, isText)
  paddingClasses = getPaddingClasses(paddingClasses, isText)
  roundedClasses = getRoundedClasses(roundedClasses)
  // textColorClasses = getTextColorClasses(textColorClasses, color)
  textSizeClasses = getTextSizeClasses(textSizeClasses, isText, size)
  transitionClasses = getTransitionClasses(transitionClasses)

  className = classnames(
    backgroundClasses,
    // backgroundColorClasses,
    className,
    borderClasses,
    defaultClasses,
    paddingClasses,
    roundedClasses,
    size,
    textColorClasses,
    textSizeClasses,
    transitionClasses
  )

  const newProps = omit(props, [
    'backgroundColorClasses',
    'borderClasses',
    'noAnim',
    'isBold',
    'isLowOpacity',
    'isText',
    'paddingClasses',
    'roundedClasses',
    'size',
    'textColorClasses',
    'textSizeClasses',
    'transitionClasses'
  ])

  if (href && as) {
    const linkProps = omit(newProps, ['children', 'type'])

    return (
      <Link href={href} as={as}>
        <a
          {...linkProps}
          ref={buttonRef}
          anim={disabled || noAnim ? '' : 'ripple'}
          className={className}
        >
          {children}
        </a>
      </Link>
    )
  } else {
    return (
      <button
        {...newProps}
        ref={buttonRef}
        anim={disabled || noAnim ? '' : 'ripple'}
        className={className}
      />
    )
  }
}
