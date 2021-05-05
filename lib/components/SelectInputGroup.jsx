import React from 'react'
import Select from 'react-select'

export const SelectInputGroup = (props) => {
  const { options, placeholder } = props

  const dot = (color = '#4c249f', image) => {
    const background = image
      ? { backgroundImage: `url(${image})` }
      : {
          backgroundColor: color
        }

    return {
      'alignItems': 'center',
      'display': 'flex',

      ':before': {
        ...background,
        backgroundSize: `cover`,
        borderRadius: 10,
        content: '" "',
        display: 'block',
        marginRight: 8,
        height: 20,
        width: 20
      }
    }
  }

  const styles = {
    control: (styles, { isDisabled, isFocused, isSelected }) => {
      let borderColor = 'transparent'
      let boxShadow = ''
      let backgroundColor = 'var(--color-bg-body)'

      if (isDisabled) {
        backgroundColor = 'var(--color-bg-secondary) !important'
      }
      if (isFocused) {
        borderColor = 'var(--color-border-accent-3)'
        boxShadow = '0 0 0 1px var(--color-border-accent-3)'
      }

      return {
        ...styles,
        '&:hover': {
          borderColor: 'var(--color-border-accent-3)'
        },
        'cursor': 'pointer',
        borderColor,
        boxShadow,
        backgroundColor,
        'borderRadius': 100,
        'color': 'var(--color-text-whitesmoke)',
        'fontSize': 18,
        'padding': '1rem',
        'paddingLeft': '2.5rem',
        'paddingRight': '2.5rem'
        // '@media only screen and (max-width: 1600px)': {
        //   ...styles['@media only screen and (max-width: 1600px)'],
        //   marginRight: '7.5rem'
        // }
      }
    },
    dropdownIndicator: (styles, { isFocused }) => ({
      ...styles,
      'color': 'white',
      '&:hover': {
        color: 'white'
      },
      'transition': 'all 150ms ease-out',
      'transform': isFocused ? 'rotate(180deg)' : ''
    }),
    indicatorsContainer: (styles) => ({
      ...styles,
      transform: 'scale(1.5)'
    }),
    indicatorSeparator: (styles) => ({
      ...styles,
      display: 'none'
    }),
    group: (provided) => ({ ...provided, cursor: 'pointer' }),
    groupHeading: (provided) => ({
      ...provided,
      color: 'var(--color-text-inverse)',
      paddingBottom: '0.25rem',
      paddingTop: '0.75rem',
      paddingLeft: '3.25rem',
      paddingRight: '3.25rem'
    }),
    menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
    option: (styles, { data, isFocused, isSelected }) => {
      let backgroundColor = 'var(--color-bg-body)'
      let color = 'var(--color-text-whitesmoke)'

      return {
        ...styles,
        ...dot(data.color, data.image),
        '&:hover': {
          backgroundColor: 'rgba(76, 36, 159, 0.7)',
          color: 'var(--color-text-highlight-1)'
        },
        ':active': {
          ...styles[':active'],
          backgroundColor: isSelected ? data.color : color
        },
        backgroundColor,
        color,
        'cursor': 'pointer',
        'transition': 'all 150ms ease-out',
        'fontSize': 18,
        'paddingLeft': '3.25rem',
        'paddingRight': '3.25rem'
      }
    },
    input: (styles) => ({
      ...styles,
      ...dot(),
      color: 'var(--color-text-inverse)'
    }),
    menu: (styles) => ({ ...styles, margin: 0, backgroundColor: 'var(--color-bg-body)' }),
    placeholder: (styles) => ({
      ...styles,
      ...dot(),
      color: 'var(--color-text-whitesmoke)',
      fontSize: 24
    }),
    singleValue: (styles, { data }) => ({
      ...styles,
      ...dot(data.color, data.image),
      color: 'var(--color-text-inverse)',
      fontSize: 24
    })
  }

  return (
    <>
      <div id='backdrop' />
      <div className='relative' style={{ zIndex: 100 }}>
        <Select
          onMenuOpen={() => {
            document.getElementById('backdrop').classList.add('overlay')
          }}
          onMenuClose={() => {
            document.getElementById('backdrop').classList.remove('overlay')
          }}
          // defaultMenuIsOpen={true}
          placeholder={placeholder}
          menuPortalTarget={document.body}
          styles={styles}
          options={options}
        />
      </div>
    </>
  )
}
