import React from 'react'

import { Button } from 'lib/components/Button'
import { RadioInputGroup } from 'lib/components/RadioInputGroup'
import { TokenDropdown } from 'lib/components/TokenDropdown'
import { YieldServiceDropdown } from 'lib/components/YieldServiceDropdown'
import { TextInputGroup } from 'lib/components/TextInputGroup'


export const BuilderForm = (props) => {
  const {
    handleSubmit,
    vars,
    stateSetters,
  } = props

  const {
    yieldService,
    rngService,
    prizePeriodSeconds,
    sponsorshipName,
    sponsorshipSymbol,
    ticketName,
    ticketSymbol,
    maxExitFeeMantissa,
    maxTimelockDuration,
    ticketCreditLimitMantissa,
  } = vars

  const {
    setAToken,
    setCToken,
    setYieldService,
    setRngService,
    setPrizePeriodSeconds,
    setSponsorshipName,
    setSponsorshipSymbol,
    setTicketName,
    setTicketSymbol,
    setMaxExitFeeMantissa,
    setMaxTimelockDuration,
    setTicketCreditLimitMantissa,
  } = stateSetters

  const handleYieldServiceChange = (newYieldService) => {
    setYieldService(newYieldService)
  }

  const handleTokenChange = (newToken) => {
    switch (yieldService) {
      case 'aave':
        setAToken(newToken)
        break
      case 'compound':
        setCToken(newToken)
        break
      default:
        break
    }
  }

  const handleRngServiceChange = (e) => {
    setRngService(e.target.value)
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="font-bold mb-8 py-2 text-lg sm:text-xl lg:text-2xl text-default">
          Prize Pool Parameters:
        </div>

        <label htmlFor={'token'} className="mt-0 trans text-purple-300 hover:text-white">
          Yield service to use:
        </label>
        <YieldServiceDropdown onChange={handleYieldServiceChange} />

        <label htmlFor={'token'} className="mt-0 trans text-purple-300 hover:text-white">
          Yield service token to use:
        </label>
        <TokenDropdown onChange={handleTokenChange} yieldService={yieldService} />

        <RadioInputGroup
          label={
            <>
              RNG Service: <span className="text-default italic">(Random number generator)</span>
            </>
          }
          name="_rngService"
          onChange={handleRngServiceChange}
          value={rngService}
          radios={[
            {
              value: 'blockhash',
              label: 'Blockhash'
            },
            {
              value: 'chainlink',
              label: 'Chainlink'
            }
          ]}
        />

        {/* <TextInputGroup
        id='_prizePeriodStartAt'
        label={<>
          Prize period start <span className='text-default italic'> (unix timestamp, 0 is 'now()')</span>
        </>}
        required
        type='number'
        pattern='\d+'
        onChange={(e) => setPrizePeriodStartAt(e.target.value)}
        value={prizePeriodStartAt}
      /> */}

        <TextInputGroup
          id="_prizePeriodSeconds"
          label={
            <>
              Prize period <span className="text-default italic"> (in seconds)</span>
            </>
          }
          required
          type="number"
          pattern="\d+"
          onChange={(e) => setPrizePeriodSeconds(e.target.value)}
          value={prizePeriodSeconds}
        />

        <TextInputGroup
          id="_sponsorshipName"
          label={
            <>
              Sponsorship Name: <span className="text-default italic">(eg. 'Sponsorship')</span>
            </>
          }
          placeholder="(eg. DAI Sponsorship)"
          required
          onChange={(e) => setSponsorshipName(e.target.value)}
          value={sponsorshipName}
        />

        <TextInputGroup
          id="_sponsorshipSymbol"
          label={
            <>
              Sponsorship Symbol: <span className="text-default italic">(eg. 'SPON')</span>
            </>
          }
          placeholder="(eg. DSPON)"
          required
          onChange={(e) => setSponsorshipSymbol(e.target.value)}
          value={sponsorshipSymbol}
        />

        <TextInputGroup
          id="_ticketName"
          label={
            <>
              Ticket Name: <span className="text-default italic">(eg. 'Ticket')</span>
            </>
          }
          placeholder="(eg. DAI Ticket)"
          required
          onChange={(e) => setTicketName(e.target.value)}
          value={ticketName}
        />

        <TextInputGroup
          id="_ticketSymbol"
          label={
            <>
              Ticket Symbol: <span className="text-default italic">(eg. 'TICK')</span>
            </>
          }
          placeholder="(eg. DTICK)"
          required
          onChange={(e) => setTicketSymbol(e.target.value)}
          value={ticketSymbol}
        />

        <TextInputGroup
          id="_maxExitFeeMantissa"
          label={
            <>
              Max Exit Fee:{' '}
              <span className="text-default italic">
                (a percentage in decimals, eg. 0.5 == 50%)
              </span>
            </>
          }
          required
          onChange={(e) => setMaxExitFeeMantissa(e.target.value)}
          value={maxExitFeeMantissa}
        />

        <TextInputGroup
          id="_maxTimelockDuration"
          label={
            <>
              Max Timelock Duration: <span className="text-default italic">(in seconds)</span>
            </>
          }
          required
          onChange={(e) => setMaxTimelockDuration(e.target.value)}
          value={maxTimelockDuration}
        />

        <TextInputGroup
          id="_ticketCreditLimitMantissa"
          label={
            <>
              Credit Limit:{' '}
              <span className="text-default italic">
                (a percentage in decimals, eg. 0.1 == 10%)
              </span>
            </>
          }
          required
          onChange={(e) => setTicketCreditLimitMantissa(e.target.value)}
          value={ticketCreditLimitMantissa}
        />

        <div className="mt-10 mb-0">
          <Button>Create Prize Pool</Button>
        </div>
      </form>
    </>
  )
}
