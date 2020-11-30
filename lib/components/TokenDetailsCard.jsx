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

function isValidTokenData(data) {
  return data && data.tokenDecimals && data.tokenSymbol && data.tokenName
}

export const TokenDetailsCard =  (props) => {

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
    setSponsorshipSymbol,
  } = props

  return <Card>
    <InputLabel 
      primary='Token Details'
      description='A name and a ticker symbol for the ERC20 token created by the Prize Pool for managing a users ticket balance.'
    >
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
      />
    </InputLabel>

    <Collapse title='Advanced Settings' className='mt-4 sm:mt-8'>

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
          maxLength="5"
          onChange={(e) => {
            setUserChangedTicketSymbol(true)
            setTicketSymbol(e.target.value)
          }}
          value={ticketSymbol}
        />
      </div>

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
          maxLength="5"
          onChange={(e) => {
            setUserChangedSponsorshipTicker(true)
            setSponsorshipSymbol(e.target.value)
          }}
          value={sponsorshipSymbol}
        />
      </div>
    </Collapse>
  </Card>
}

export const PrizePoolInputs = props => {
  switch (props.prizePoolType) {
    case PRIZE_POOL_TYPE.compound: {
      return (
        <CompoundPrizePoolInputs
          {...props}
        />
      )
    }
    case PRIZE_POOL_TYPE.stake: {
      return (
        <StakingPrizePoolInputs
          {...props}
        />
      )
    }
  }
}

const CompoundPrizePoolInputs = props => {
  const { updateCToken, cToken } = props;

  return <TokenDropdown onChange={updateCToken} cToken={cToken} />
}

const StakingPrizePoolInputs = props => {
  const {
    stakedTokenAddress,
    stakedTokenData,
    setStakedTokenAddress,
    setStakedTokenData,
    updateTicketLabels
  } = props;

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
          updateTicketLabels(PRIZE_POOL_TYPE.stake, "")  
          return
        }
        setIsError(false)
        setStakedTokenData(data)
        updateTicketLabels(PRIZE_POOL_TYPE.stake, data.tokenSymbol)
      } else {
        setIsError(true)
        setStakedTokenData(undefined)
        updateTicketLabels(PRIZE_POOL_TYPE.stake, "")
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
        onChange={e => {
          setUserHasChangedAddress(true)
          setStakedTokenAddress(e.target.value)
        }}
        value={stakedTokenAddress}
      />
      {stakedTokenData && <>
          <p>{stakedTokenData.tokenSymbol}</p>
          <p>{stakedTokenData.tokenName}</p>
          <p>{stakedTokenData.tokenDecimals} Decimals</p>
        </>
      }
    </>
  )
}
