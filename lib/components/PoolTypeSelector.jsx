import { PRIZE_POOL_TYPE } from 'lib/constants'
import { fetchTokenChainData } from 'lib/utils/fetchTokenChainData'
import { isAddress } from 'lib/utils/isAddress'
import React, { useContext, useEffect, useState } from 'react'
import { InputCard } from './InputCard'
import { InputLabel } from './InputLabel'
import { PrizePoolDropdown } from './PrizePoolDropdown'
import { TextInputGroup } from './TextInputGroup'
import { TokenDropdown } from './TokenDropdown'
import { WalletContext } from './WalletContextProvider'

function isValidTokenData(data) {
  return data && data.tokenDecimals && data.tokenSymbol && data.tokenName
}

export const PoolTypeSelector = props => {
  const { 
    prizePoolType,
    cToken,
    updatePrizePoolType,
    setTicketName,
    setTicketSymbol,
    setSponsorshipName,
    setSponsorshipSymbol,
    userChangedTicketName,
    userChangedTicketSymbol,
    userChangedSponsorshipName,
    userChangedSponsorshipTicker,
    ...prizePoolInputProps 
  } = props
  
  return (
    <>
      <InputCard>
        <InputLabel 
          title="Pool Type"
        >
          <PrizePoolDropdown 
            updatePrizePoolType={updatePrizePoolType}
          />
        </InputLabel>
      </InputCard>
      <PrizePoolInputs prizePoolType={prizePoolType} {...prizePoolInputProps} />
    </>
  )
}

const PrizePoolInputs = props => {
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
  const {updateCToken} = props;

  return (
    <InputCard>
      <InputLabel
        title="Deposit Token"
      >
        <TokenDropdown onChange={updateCToken} />
      </InputLabel>
    </InputCard>
  )
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
    <InputCard>
      <InputLabel
        title="Staked Token Address"
      >
        <TextInputGroup
          id='_stakedTokenAddress'
          label='Token address'
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
      </InputLabel>
    </InputCard>
  )
}
