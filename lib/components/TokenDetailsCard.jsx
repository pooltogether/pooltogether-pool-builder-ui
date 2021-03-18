import React, { useContext, useEffect, useState } from 'react'
import { Card } from 'lib/components/Card'
import { InputLabel } from 'lib/components/InputLabel'
import { TextInputGroup } from 'lib/components/TextInputGroup'
import { Collapse } from 'lib/components/Collapse'
import { TokenDropdown } from 'lib/components/TokenDropdown'
import { PRIZE_POOL_TYPE } from 'lib/constants'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { isAddress } from 'lib/utils/isAddress'
import { fetchTokenChainData } from 'lib/utils/fetchTokenChainData'
import classnames from 'classnames'
import { fetchYieldSourceChainData } from 'lib/utils/fetchYieldSourceChainData'

function isValidTokenData(data) {
  return data && data.tokenDecimals && data.tokenSymbol && data.tokenName
}

export const TokenDetailsCard = (props) => {
  const {
    // PrizePoolInputs
    prizePoolType,
    cToken,
    updateCToken,
    stakedTokenAddress,
    stakedTokenData,
    setStakedTokenAddress,
    setStakedTokenData,
    updateTicketLabels,
    yieldSourceAddress,
    setYieldSourceAddress,
    yieldSourceData,
    setYieldSourceData,
    // Advanced Settings
    setUserChangedTicketName,
    ticketName,
    setTicketName,
    setUserChangedTicketSymbol,
    ticketSymbol,
    setTicketSymbol,
    setUserChangedSponsorshipName,
    sponsorshipName,
    setSponsorshipName,
    setUserChangedSponsorshipTicker,
    sponsorshipSymbol,
    setSponsorshipSymbol
  } = props

  let tokenDetailsDescription
  let label = 'Deposit Token'
  if (prizePoolType === PRIZE_POOL_TYPE.compound) {
    tokenDetailsDescription =
      'The chosen deposit token defines what a user deposits to join the prize pool. All deposits are automatically transferred into the Compound Protocol to generate yield.'
  } else if (prizePoolType === PRIZE_POOL_TYPE.stake) {
    tokenDetailsDescription =
      'The ERC20 token at the address supplied defines what a user deposits to join the prize pool.'
  } else if (prizePoolType === PRIZE_POOL_TYPE.yield) {
    tokenDetailsDescription =
      'The yield source at the provided address must implement the Yield Source Interface. An ERC20 token will be accessible from the address supplied which defines what a user deposits to join the prize pool.'
    label = 'Yield Source'
  }
  tokenDetailsDescription +=
    ' When a user deposits, they will receive a token back representing their deposit and chance to win. The name and symbol of this ticket token can be customized in “Advanced Settings”.'

  return (
    <Card>
      <InputLabel primary={label} description={tokenDetailsDescription} className='mb-4'>
        <PrizePoolInputs
          prizePoolType={prizePoolType}
          // Compound Prize Pool
          updateCToken={updateCToken}
          cToken={cToken}
          // Staked Prize Pool
          stakedTokenAddress={stakedTokenAddress}
          stakedTokenData={stakedTokenData}
          setStakedTokenAddress={setStakedTokenAddress}
          setStakedTokenData={setStakedTokenData}
          updateTicketLabels={updateTicketLabels}
          // Yield Prize Pool
          yieldSourceAddress={yieldSourceAddress}
          setYieldSourceAddress={setYieldSourceAddress}
          yieldSourceData={yieldSourceData}
          setYieldSourceData={setYieldSourceData}
        />
      </InputLabel>

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
  )
}

export const PrizePoolInputs = (props) => {
  switch (props.prizePoolType) {
    case PRIZE_POOL_TYPE.compound: {
      return <CompoundPrizePoolInputs {...props} />
    }
    case PRIZE_POOL_TYPE.stake: {
      return <StakingPrizePoolInputs {...props} />
    }
    case PRIZE_POOL_TYPE.yield: {
      return <YieldPrizePoolInputs {...props} />
    }
  }
}

const CompoundPrizePoolInputs = (props) => {
  const { updateCToken, cToken } = props

  return <TokenDropdown onChange={updateCToken} cToken={cToken} />
}

const StakingPrizePoolInputs = (props) => {
  const {
    stakedTokenAddress,
    stakedTokenData,
    setStakedTokenAddress,
    setStakedTokenData,
    updateTicketLabels
  } = props

  const [isError, setIsError] = useState(false)
  const [userHasChangedAddress, setUserHasChangedAddress] = useState(false)
  const isSuccess = isValidTokenData(stakedTokenData)

  const walletContext = useContext(WalletContext)

  useEffect(() => {
    async function getSymbol() {
      if (isAddress(stakedTokenAddress)) {
        const provider = walletContext.state.provider
        const data = await fetchTokenChainData(provider, stakedTokenAddress)
        if (!isValidTokenData(data)) {
          setIsError(true)
          setStakedTokenData(undefined)
          updateTicketLabels(PRIZE_POOL_TYPE.stake, '')
          return
        }
        setIsError(false)
        setStakedTokenData(data)
        updateTicketLabels(PRIZE_POOL_TYPE.stake, data.tokenSymbol)
      } else {
        setIsError(true)
        setStakedTokenData(undefined)
        updateTicketLabels(PRIZE_POOL_TYPE.stake, '')
      }
    }
    getSymbol()
  }, [stakedTokenAddress])

  return (
    <>
      <TextInputGroup
        id='_stakedTokenAddress'
        label='Stake token address'
        isError={isError && userHasChangedAddress}
        isSuccess={isSuccess}
        placeholder='(eg. 0x1f9840a85d5af5bf1d1762f925bdaddc4201f984)'
        required
        onChange={(e) => {
          setUserHasChangedAddress(true)
          setStakedTokenAddress(e.target.value)
        }}
        value={stakedTokenAddress}
      />
      {stakedTokenData && (
        <div className='flex justify-end'>
          <span
            className='rounded-full leading-none bg-opacity-75 bg-yellow-2 text-yellow-2 px-2 py-1 mr-2 text-xxs sm:text-xs'
            style={{ height: 'min-content' }}
          >
            {stakedTokenData.tokenSymbol}
          </span>
          <span
            className='rounded-full leading-none bg-opacity-75 bg-blue-2 text-whitesmoke px-2 py-1 mr-2 text-xxs sm:text-xs'
            style={{ height: 'min-content' }}
          >
            {stakedTokenData.tokenName}
          </span>
          <span
            className='rounded-full leading-none bg-opacity-75 bg-purple-2 text-text-accent-1 px-2 py-1 mr-2 text-xxs sm:text-xs'
            style={{ height: 'min-content' }}
          >
            {stakedTokenData.tokenDecimals} Decimals
          </span>
        </div>
      )}
    </>
  )
}

const YieldPrizePoolInputs = (props) => {
  const {
    yieldSourceAddress,
    setYieldSourceAddress,
    yieldSourceData,
    setYieldSourceData,
    updateTicketLabels
  } = props

  const [isError, setIsError] = useState(false)
  const [userHasChangedAddress, setUserHasChangedAddress] = useState(false)
  const isSuccess = isValidTokenData(yieldSourceData)

  const walletContext = useContext(WalletContext)

  useEffect(() => {
    async function getSymbol() {
      if (isAddress(yieldSourceAddress)) {
        const provider = walletContext.state.provider

        const data = await fetchYieldSourceChainData(provider, yieldSourceAddress)

        if (!isValidTokenData(data)) {
          setIsError(true)
          setYieldSourceData(undefined)
          updateTicketLabels(PRIZE_POOL_TYPE.yield, '')
          return
        }

        setIsError(false)
        setYieldSourceData(data)
        updateTicketLabels(PRIZE_POOL_TYPE.yield, data.tokenSymbol)
      } else {
        setIsError(true)
        setYieldSourceData(undefined)
        updateTicketLabels(PRIZE_POOL_TYPE.yield, '')
      }
    }
    getSymbol()
  }, [yieldSourceAddress])

  return (
    <>
      <TextInputGroup
        id='_yieldSourceAddress'
        label='Yield source address'
        isError={isError && userHasChangedAddress}
        isSuccess={isSuccess}
        placeholder='(eg. 0x1f9840a85d5af5bf1d1762f925bdaddc4201f984)'
        required
        onChange={(e) => {
          setUserHasChangedAddress(true)
          setYieldSourceAddress(e.target.value)
        }}
        value={yieldSourceAddress}
      />
      {yieldSourceData && (
        <div className='flex justify-end'>
          <span
            className='rounded-full leading-none bg-opacity-75 bg-yellow-2 text-yellow-2 px-2 py-1 mr-2 text-xxs sm:text-xs'
            style={{ height: 'min-content' }}
          >
            {yieldSourceData.tokenSymbol}
          </span>
          <span
            className='rounded-full leading-none bg-opacity-75 bg-blue-2 text-whitesmoke px-2 py-1 mr-2 text-xxs sm:text-xs'
            style={{ height: 'min-content' }}
          >
            {yieldSourceData.tokenName}
          </span>
          <span
            className='rounded-full leading-none bg-opacity-75 bg-purple-2 text-text-accent-1 px-2 py-1 mr-2 text-xxs sm:text-xs'
            style={{ height: 'min-content' }}
          >
            {yieldSourceData.tokenDecimals} Decimals
          </span>
        </div>
      )}
    </>
  )
}
