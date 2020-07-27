import React from 'react'

import { Button } from 'lib/components/Button'
import { Input } from 'lib/components/Input'
import { RadioInputGroup } from 'lib/components/RadioInputGroup'
import { TextInputGroup } from 'lib/components/TextInputGroup'

import DaiSvg from 'assets/images/dai.svg'
import UsdcSvg from 'assets/images/usdc.svg'
import UsdtSvg from 'assets/images/usdt.svg'

export const BuilderForm = (props) => {
  const {
    handleSubmit,
    vars,
    stateSetters,
  } = props

  const {
    cToken,
    prizePeriodSeconds,
    sponsorshipName,
    sponsorshipSymbol,
    ticketName,
    ticketSymbol,
    maxExitFeeMantissa,
    maxTimelockDuration,
    exitFeeMantissa,
    creditRateMantissa,
    externalAwards,
  } = vars

  const {
    setCToken,
    setPrizePeriodSeconds,
    setSponsorshipName,
    setSponsorshipSymbol,
    setTicketName,
    setTicketSymbol,
    setMaxExitFeeMantissa,
    setMaxTimelockDuration,
    setExitFeeMantissa,
    setCreditRateMantissa,
    setExternalAwards,
  } = stateSetters

  const handleTickerChange = (e) => {
    setCToken(e.target.value)
  }

  return <>
    <form
      onSubmit={handleSubmit}
    >
      <div
        className='font-bold mb-8 py-2 text-lg sm:text-xl lg:text-2xl'
      >
        Prize Pool Parameters:
      </div>

      <RadioInputGroup
        label='Token to use:'
        name='cToken'
        onChange={handleTickerChange}
        value={cToken}
        radios={[
          {
            value: 'cDai',
            label: <>
              <img src={DaiSvg} className='inline-block w-6 sm:w-8 mr-2 -mt-1' />Dai
            </>
          },
          {
            value: 'cUsdc',
            label: <>
              <img src={UsdcSvg} className='inline-block w-6 sm:w-8 mr-2 -mt-1' />USDC
            </>
          },
          {
            value: 'cUsdt',
            label: <>
              <img src={UsdtSvg} className='inline-block w-6 sm:w-8 mr-2 -mt-1' />Tether
            </>
          },
        ]}
      />

      <TextInputGroup
        id='_prizePeriodSeconds'
        label={<>
          Prize period <span className='text-purple-600 italic'> (in seconds)</span>
        </>}
        required
        type='number'
        pattern='\d+'
        onChange={(e) => setPrizePeriodSeconds(e.target.value)}
        value={prizePeriodSeconds}
      />

      <TextInputGroup
        id='_sponsorshipName'
        label={<>
          Sponsorship Name: <span className='text-purple-600 italic'>(eg. 'Sponsorship')</span>
        </>}
        required
        onChange={(e) => setSponsorshipName(e.target.value)}
        value={sponsorshipName}
      />

      <TextInputGroup
        id='_sponsorshipSymbol'
        label={<>
          Sponsorship Symbol: <span className='text-purple-600 italic'>(eg. 'SPON')</span>
        </>}
        required
        onChange={(e) => setSponsorshipSymbol(e.target.value)}
        value={sponsorshipSymbol}
      />

      <TextInputGroup
        id='_ticketName'
        label={<>
          Ticket Name: <span className='text-purple-600 italic'>(eg. 'Ticket')</span>
        </>}
        required
        onChange={(e) => setTicketName(e.target.value)}
        value={ticketName}
      />

      <TextInputGroup
        id='_ticketSymbol'
        label={<>
          Ticket Symbol: <span className='text-purple-600 italic'>(eg. 'TICK')</span>
        </>}
        required
        onChange={(e) => setTicketSymbol(e.target.value)}
        value={ticketSymbol}
      />

      <TextInputGroup
        id='_maxExitFeeMantissa'
        label={<>
          Max Exit Fee:
        </>}
        required
        onChange={(e) => setMaxExitFeeMantissa(e.target.value)}
        value={maxExitFeeMantissa}
      />

      <TextInputGroup
        id='_maxTimelockDuration'
        label={<>
          Max Timelock Duration: <span className='text-purple-600 italic'>(in seconds)</span>
        </>}
        required
        onChange={(e) => setMaxTimelockDuration(e.target.value)}
        value={maxTimelockDuration}
      />

      <TextInputGroup
        id='_exitFeeMantissa'
        label={<>
          Exit Fee:
        </>}
        required
        onChange={(e) => setExitFeeMantissa(e.target.value)}
        value={exitFeeMantissa}
      />

      <TextInputGroup
        id='_creditRateMantissa'
        label={<>
          Credit Rate:
        </>}
        required
        onChange={(e) => setCreditRateMantissa(e.target.value)}
        value={creditRateMantissa}
      />

      <div
        className='mt-10 mb-0'
      >
        <Button>
          Create Prize Pool
        </Button>
      </div>
    </form>
  </>
}
