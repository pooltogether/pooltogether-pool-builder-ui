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
    _prizePeriodInSeconds,
    _builderStrategy,
    _prizeStrategyAddress,
    _sponsorshipName,
    _sponsorshipSymbol,
    _ticketName,
    _ticketSymbol,
  } = vars

  const {
    setCToken,
    setBuilderStrategy,
    setPrizeStrategyAddress,
    setPrizePeriodInSeconds,
    setSponsorshipName,
    setSponsorshipSymbol,
    setTicketName,
    setTicketSymbol,
  } = stateSetters

  const handleTickerChange = (e) => {
    setCToken(e.target.value)
  }

  const handleBuilderStrategyChange = (e) => {
    setBuilderStrategy(e.target.value)
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

      <RadioInputGroup
        label='Prize strategy to use:'
        name='_builderStrategy'
        onChange={handleBuilderStrategyChange}
        value={_builderStrategy}
        radios={[
          {
            value: 'singleRandomWinner',
            label: 'Single Random Winner'
          },
          {
            value: 'customPrizeStrategy',
            label: 'Custom prize strategy'
          },
        ]}
      />


      {_builderStrategy === 'customPrizeStrategy' && <>
        <div
          className='animated fadeIn'
        >
          <TextInputGroup
            id='_prizeStrategyAddress'
            label={'Custom prize strategy address:'}
            required
            onChange={(e) => setPrizeStrategyAddress(e.target.value)}
            value={_prizeStrategyAddress}
          />
        </div>
      </>}
      



      <TextInputGroup
        id='_prizePeriodInSeconds'
        label={<>
          Prize period <span className='text-purple-600 italic'> (in seconds)</span>
        </>}
        required
        type='number'
        pattern='\d+'
        onChange={(e) => setPrizePeriodInSeconds(e.target.value)}
        value={_prizePeriodInSeconds}
      />

      <TextInputGroup
        id='_sponsorshipName'
        label={<>
          Sponsorship Name: <span className='text-purple-600 italic'>(eg. 'Sponsorship')</span>
        </>}
        required
        onChange={(e) => setSponsorshipName(e.target.value)}
        value={_sponsorshipName}
      />

      <TextInputGroup
        id='_sponsorshipSymbol'
        label={<>
          Sponsorship Symbol: <span className='text-purple-600 italic'>(eg. 'SPON')</span>
        </>}
        required
        onChange={(e) => setSponsorshipSymbol(e.target.value)}
        value={_sponsorshipSymbol}
      />

      <TextInputGroup
        id='_ticketName'
        label={<>
          Ticket Name: <span className='text-purple-600 italic'>(eg. 'Ticket')</span>
        </>}
        required
        onChange={(e) => setTicketName(e.target.value)}
        value={_ticketName}
      />

      <TextInputGroup
        id='_ticketSymbol'
        label={<>
          Ticket Symbol: <span className='text-purple-600 italic'>(eg. 'TICK')</span>
        </>}
        required
        onChange={(e) => setTicketSymbol(e.target.value)}
        value={_ticketSymbol}
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
