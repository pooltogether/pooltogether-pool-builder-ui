import React from 'react'
import { PRIZE_POOL_TYPES } from '@pooltogether/current-pool-data'

import { Card } from 'lib/components/Card'
import { InputLabel } from 'lib/components/InputLabel'
import { TextInputGroup } from 'lib/components/TextInputGroup'
import { Collapse } from 'lib/components/Collapse'
import { Erc20Image } from './Erc20Image'

const Line = () => <hr className='mt-2 mb-4 sm:mb-8 sm:mt-6 opacity-60 xs:opacity-100' />

export const TokenDetailsCard = (props) => {
  const {
    // Advanced Settings
    setUserChangedTicketName,
    setUserChangedTicketSymbol,
    setUserChangedSponsorshipName,
    setUserChangedSponsorshipTicker,
    errorDeterminingPrizePoolType,
    yieldSourceLabel,
    vars,
    stateSetters
  } = props

  const {
    depositToken,
    prizePool,
    sponsorshipName,
    sponsorshipSymbol,
    ticketName,
    ticketSymbol
  } = vars

  const { setSponsorshipName, setSponsorshipSymbol, setTicketName, setTicketSymbol } = stateSetters

  if (errorDeterminingPrizePoolType) {
    return null
  }

  let tokenDetailsDescription
  if (prizePool.type === PRIZE_POOL_TYPES.compound || prizePool.knownYieldSource) {
    tokenDetailsDescription = (
      <>
        All deposits are automatically transferred into the <b>{yieldSourceLabel} Protocol</b> to
        generate yield.
      </>
    )
  } else if (prizePool.type === PRIZE_POOL_TYPES.stake) {
    tokenDetailsDescription = (
      <>The prizes for the pool will need to be transferred into the pool each prize period.</>
    )
  } else if (prizePool.type === PRIZE_POOL_TYPES.genericYield) {
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
    prizePool.type === PRIZE_POOL_TYPES.genericYield || prizePool.type === PRIZE_POOL_TYPES.compound

  return (
    <div style={{ marginTop: -50 }}>
      <div className='bg-card pt-6 sm:pt-0'>
        <Card>
          {!isYieldPool && <StakeDisplay {...props} prizePool={prizePool} />}
          {isYieldPool && <YieldSourceDisplay {...props} prizePool={prizePool} />}
          <DepositTokenDisplay {...props} prizePool={prizePool} depositToken={depositToken} />

          <p>
            Users will deposit{' '}
            <b>
              ${depositToken.tokenSymbol} - {depositToken.tokenName}
            </b>{' '}
            to join the prize pool.
          </p>

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
                label='Ticket symbol'
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
                  label='Sponsorship name'
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
                  label='Sponsorship symbol'
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
  const { depositToken, prizePool } = props

  if (!depositToken?.tokenName) {
    return null
  }

  return (
    <>
      <h6>Deposit token:</h6>
      <div className='flex text-sm sm:text-base mt-2 mb-6'>
        <span className='flex items-center rounded-full leading-none bg-blue-2 text-whitesmoke px-3 py-1 mr-2'>
          <Erc20Image prizePool={prizePool} address={depositToken.tokenAddress} /> $
          {depositToken.tokenSymbol} - {depositToken.tokenName}
        </span>
        <span className='flex items-center rounded-full leading-none bg-purple-2 px-3 py-1 mr-2 opacity-80'>
          {depositToken.tokenDecimals} Decimals
        </span>
      </div>
    </>
  )
}

const YieldSourceImage = (props) => {
  const { yieldSourceLabel } = props

  let src
  switch (yieldSourceLabel) {
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
  const { prizePool, yieldSourceLabel } = props

  return (
    <>
      <h6>Yield source:</h6>

      <div className='flex text-sm sm:text-base mt-2 mb-6'>
        <span className='flex items-center rounded-full leading-none bg-opacity-75 bg-blue-2 text-whitesmoke px-3 py-1 mr-2'>
          {prizePool.type === PRIZE_POOL_TYPES.compound || prizePool.knownYieldSource ? (
            <>
              <YieldSourceImage {...props} prizePool={prizePool} /> {yieldSourceLabel}
            </>
          ) : (
            'Custom Yield Source'
          )}
        </span>
      </div>
    </>
  )
}

const StakeDisplay = (props) => {
  return (
    <>
      <h6>Prize pool type:</h6>

      <div className='flex text-sm sm:text-base mt-2 mb-6'>
        <span className='flex items-center rounded-full leading-none bg-opacity-75 bg-blue-2 text-whitesmoke px-3 py-1 mr-2'>
          Stake
        </span>
      </div>
    </>
  )
}
