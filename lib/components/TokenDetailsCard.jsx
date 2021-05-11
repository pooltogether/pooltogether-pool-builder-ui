import React, { useContext, useEffect, useState } from 'react'

import { Card } from 'lib/components/Card'
import { InputLabel } from 'lib/components/InputLabel'
import { TextInputGroup } from 'lib/components/TextInputGroup'
import { Collapse } from 'lib/components/Collapse'
// import { TokenDropdown } from 'lib/components/TokenDropdown'
import { PRIZE_POOL_TYPE } from 'lib/constants'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { isAddress } from 'lib/utils/isAddress'
import { fetchTokenChainData } from 'lib/utils/fetchTokenChainData'
import { fetchYieldSourceChainData } from 'lib/utils/fetchYieldSourceChainData'
import { Erc20Image } from './Erc20Image'

function isValidTokenData(data) {
  return data && data.tokenDecimals && data.tokenSymbol && data.tokenName
}

const Line = () => <hr className='mt-2 mb-4 sm:mb-8 sm:mt-6 opacity-60 xs:opacity-100' />

const yieldSourceLabel = (prizePool) => {
  const label = prizePool.yieldProtocol.label.split('-')[1].trim()
  return label.match('Rari Fuse') ? 'Rari Fuse Yield' : label
}

export const TokenDetailsCard = (props) => {
  const {
    updateTicketLabels,
    // Advanced Settings
    setUserChangedTicketName,
    setUserChangedTicketSymbol,
    setUserChangedSponsorshipName,
    setUserChangedSponsorshipTicker,
    vars,
    stateSetters
  } = props

  const {
    depositToken,
    prizePool,
    cToken,
    stakedTokenData,
    stakedTokenAddress,
    yieldSourceData,
    yieldSourceAddress,
    sponsorshipName,
    sponsorshipSymbol,
    ticketName,
    ticketSymbol
  } = vars

  const {
    setStakedTokenData,
    setStakedTokenAddress,
    setYieldSourceAddress,
    setYieldSourceData,
    setSponsorshipName,
    setSponsorshipSymbol,
    setTicketName,
    setTicketSymbol
  } = stateSetters

  let tokenDetailsDescription, secondary
  let label = ''
  if (prizePool.type === PRIZE_POOL_TYPE.compound) {
    tokenDetailsDescription = (
      <>
        Users will deposit{' '}
        <b>
          ${depositToken.tokenSymbol} - {depositToken.tokenName}
        </b>{' '}
        to join the prize pool. All deposits are automatically transferred into the{' '}
        <b>{yieldSourceLabel(prizePool)} Protocol</b> to generate yield.
      </>
    )
  } else if (prizePool.type === PRIZE_POOL_TYPE.stake) {
    tokenDetailsDescription = (
      <>
        The ERC20 token at the address supplied defines what a user deposits to join the prize pool.
      </>
    )
  } else if (prizePool.type === PRIZE_POOL_TYPE.customYield) {
    tokenDetailsDescription = (
      <>
        The yield source at the provided address must implement the Yield Source Interface. An ERC20
        token will be accessible from the address supplied which defines what a user deposits to
        join the prize pool.
      </>
    )
  }

  const tokenDetailsDescriptionSecondary = (
    <>
      When a user deposits, they will receive a token back representing their deposit and chance to
      win. The name and symbol of this ticket token can be customized below.
    </>
  )

  const isYieldPool =
    prizePool.type === PRIZE_POOL_TYPE.customYield || prizePool.type === PRIZE_POOL_TYPE.compound

  return (
    <div style={{ marginTop: -50 }}>
      <div className='bg-card pt-10'>
        <Card>
          {isYieldPool && <YieldSourceDisplay prizePool={prizePool} />}

          <DepositTokenDisplay depositToken={depositToken} />

          <InputLabel
            description={tokenDetailsDescription}
            descriptionSecondary={tokenDetailsDescriptionSecondary}
            className='mb-4'
          />

          <Line />

          <InputLabel
            secondary='Pool Ticket'
            description={`Provide a name and ticker symbol for the ERC20 token that will be created and used as the pool's tickets.`}
          >
            <div className='flex flex-col sm:flex-row sm:mb-4'>
              <TextInputGroup
                containerClassName='w-full sm:w-1/2 sm:mr-4'
                id='_ticketName'
                label={`Ticket's name`}
                placeholder='(eg. PT Compound Dai Ticket)'
                required
                onChange={(e) => {
                  setUserChangedTicketName(true)
                  setTicketName(e.target.value)
                }}
                value={ticketName}
              />

              <TextInputGroup
                id='_ticketSymbol'
                containerClassName='w-full sm:w-1/2 sm:ml-4'
                label='Ticket Ticker'
                placeholder='(eg. PCDAI)'
                required
                maxLength='5'
                onChange={(e) => {
                  setUserChangedTicketSymbol(true)
                  setTicketSymbol(e.target.value)
                }}
                value={ticketSymbol}
              />
            </div>
          </InputLabel>

          <Collapse title='Advanced Settings' className='mt-4 sm:mt-8'>
            <InputLabel
              secondary='Pool Sponsorship Ticket'
              description={`Provide a name and ticker symbol for the ERC20 token that will be created and used as the pool's sponsorship tickets. Sponsorship tickets are not eligible to win prizes.`}
            >
              <div className='flex flex-col sm:flex-row'>
                <TextInputGroup
                  id='_sponsorshipName'
                  containerClassName='w-full sm:w-1/2 sm:mr-4'
                  label='Sponsorship Name'
                  placeholder='(eg. PT Compound Dai Sponsorship)'
                  required
                  onChange={(e) => {
                    setUserChangedSponsorshipName(true)
                    setSponsorshipName(e.target.value)
                  }}
                  value={sponsorshipName}
                />

                <TextInputGroup
                  id='_sponsorshipSymbol'
                  containerClassName='w-full sm:w-1/2 sm:ml-4'
                  label='Sponsorship Ticker'
                  placeholder='(eg. SCDAI)'
                  required
                  maxLength='5'
                  onChange={(e) => {
                    setUserChangedSponsorshipTicker(true)
                    setSponsorshipSymbol(e.target.value)
                  }}
                  value={sponsorshipSymbol}
                />
              </div>
            </InputLabel>
          </Collapse>
        </Card>
      </div>
    </div>
  )
}

const DepositTokenDisplay = (props) => {
  const { depositToken } = props

  return (
    <>
      <h6>Deposit token:</h6>
      <div className='flex text-sm sm:text-base mt-2 mb-10'>
        <span className='flex items-center rounded-full leading-none bg-opacity-75 bg-blue-2 text-whitesmoke px-3 py-1 mr-2'>
          <Erc20Image address={depositToken.tokenAddress} /> ${depositToken.tokenSymbol} -{' '}
          {depositToken.tokenName}
        </span>
        <span className='flex items-center rounded-full leading-none bg-opacity-75 bg-purple-2 text-text-accent-1 px-3 py-1 mr-2'>
          {depositToken.tokenDecimals} Decimals
        </span>
      </div>
    </>
  )
}

const YieldSourceImage = (props) => {
  const { prizePool } = props

  console.log({ ysl: yieldSourceLabel(prizePool) })
  let src
  switch (yieldSourceLabel(prizePool)) {
    case 'Compound Yield': {
      src = '/tokens/comp.svg'
      break
    }
    case 'Rari Fuse Yield': {
      src = '/tokens/rgt-small.png'
      break
    }
    case 'Aave Yield': {
      src = '/tokens/aave-small.png'
      break
    }
    case 'CREAM Yield': {
      src = '/tokens/cream-small.png'
      break
    }
  }

  return <img src={src} className='inline-block w-5 h-5 rounded-full mr-2' />
}

const YieldSourceDisplay = (props) => {
  const { prizePool } = props

  return (
    <>
      <h6>Yield source:</h6>

      <div className='flex text-sm sm:text-base mt-2 mb-10'>
        <span className='flex items-center rounded-full leading-none bg-opacity-75 bg-blue-2 text-whitesmoke px-3 py-1 mr-2'>
          {prizePool.type === PRIZE_POOL_TYPE.compound ? (
            <>
              <YieldSourceImage prizePool={prizePool} /> {yieldSourceLabel(prizePool)}
            </>
          ) : (
            'Custom Yield Source'
          )}
        </span>
      </div>
    </>
  )
}
