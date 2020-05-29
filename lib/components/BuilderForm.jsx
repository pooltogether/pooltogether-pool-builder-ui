import React from 'react'

import { Button } from 'lib/components/Button'
import { Input } from 'lib/components/Input'

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

      <label
        htmlFor='_prizePeriodInSeconds'
        className='text-purple-300 hover:text-white trans mt-0 text-xl'
      >Token to use:</label>
      <div
        className='inputGroup w-full sm:w-10/12 text-base sm:text-xl lg:text-2xl'
      >
        <input
          id='cDai-radio'
          name='cToken'
          type='radio'
          onChange={handleTickerChange}
          value='cDai'
          checked={cToken === 'cDai'}
        />
        <label
          htmlFor='cDai-radio'
          className='text-purple-300 relative pl-6 py-3'
        ><img src={DaiSvg} className='inline-block w-6 sm:w-8 mr-2 -mt-1' />Dai</label>
      </div>
      <div
        className='inputGroup w-full sm:w-10/12 text-base sm:text-xl lg:text-2xl'
      >
        <input
          id='cUsdc-radio'
          name='cToken'
          type='radio'
          value='cUsdc'
          onChange={handleTickerChange}
          checked={cToken === 'cUsdc'}
        />
        <label
          htmlFor='cUsdc-radio'
          className='text-purple-300 relative pl-6 py-3'
        ><img src={UsdcSvg} className='inline-block w-6 sm:w-8 mr-2 -mt-1 ' />USDC</label>
      </div>
      <div
        className='inputGroup w-full sm:w-10/12 text-base sm:text-xl lg:text-2xl mb-8'
      >
        <input
          id='cUsdt-radio'
          name='cToken'
          type='radio'
          value='cUsdt'
          onChange={handleTickerChange}
          checked={cToken === 'cUsdt'}
        />
        <label
          htmlFor='cUsdt-radio'
          className='text-purple-300 relative pl-6 py-3'
        ><img src={UsdtSvg} className='inline-block w-6 sm:w-8 mr-2 -mt-1' />Tether</label>
      </div>

      <label
        htmlFor='builderStrategy'
        className='text-purple-300 hover:text-white trans mt-0 text-xl'
      >Prize strategy to use:</label>
      <div
        className='inputGroup w-full sm:w-10/12 text-base sm:text-xl lg:text-2xl'
      >
        <input
          id='singleRandomWinner-radio'
          name='builderStrategy'
          type='radio'
          onChange={handleBuilderStrategyChange}
          value='singleRandomWinner'
          checked={_builderStrategy === 'singleRandomWinner'}
        />
        <label
          htmlFor='singleRandomWinner-radio'
          className='text-purple-300 relative pl-6 py-3'
        >Single Random Winner</label>
      </div>
      <div
        className='inputGroup w-full sm:w-10/12 text-base sm:text-xl lg:text-2xl mb-8'
      >
        <input
          id='customPrizeStrategy-radio'
          name='builderStrategy'
          type='radio'
          value='customPrizeStrategy'
          onChange={handleBuilderStrategyChange}
          checked={_builderStrategy === 'customPrizeStrategy'}
        />
        <label
          htmlFor='customPrizeStrategy-radio'
          className='text-purple-300 relative pl-6 py-3'
        >Custom prize strategy</label>
      </div>


      {_builderStrategy === 'customPrizeStrategy' && <>
        <div
          className='animated fadeIn'
        >
          <label
            htmlFor='_prizeStrategyAddress'
            className='text-purple-300 hover:text-white trans text-xl'
          >
            Custom prize strategy address:
          </label>
          <Input
            id='_prizeStrategyAddress'
            required
            onChange={(e) => setPrizeStrategyAddress(e.target.value)}
            value={_prizeStrategyAddress}
          />
        </div>
      </>}
      



      <label
        htmlFor='_prizePeriodInSeconds'
        className='text-purple-300 hover:text-white trans text-xl'
      >
        Prize period <span className='text-purple-600 italic'> (in seconds)</span>
      </label>
      <Input
        id='_prizePeriodInSeconds'
        required
        type='number'
        pattern='\d+'
        onChange={(e) => setPrizePeriodInSeconds(e.target.value)}
        value={_prizePeriodInSeconds}
      />

      <label
        htmlFor='_sponsorshipName'
        className='text-purple-300 hover:text-white trans text-xl'
      >
        Sponsorship Name: <span className='text-purple-600 italic'>(eg. 'Sponsorship')</span>
      </label>
      <Input
        required
        id='_sponsorshipName'
        onChange={(e) => setSponsorshipName(e.target.value)}
        value={_sponsorshipName}
      />



      <label
        htmlFor='_sponsorshipSymbol'
        className='text-purple-300 hover:text-white trans text-xl'
      >
        Sponsorship Symbol: <span className='text-purple-600 italic'>(eg. 'SPON')</span>
      </label>
      <Input
        required
        id='_sponsorshipSymbol'
        onChange={(e) => setSponsorshipSymbol(e.target.value)}
        value={_sponsorshipSymbol}
      />


      <label
        htmlFor='_ticketName'
        className='text-purple-300 hover:text-white trans text-xl'
      >
        Ticket Name: <span className='text-purple-600 italic'>(eg. 'Ticket')</span>
      </label>
      <Input
        required
        id='_ticketName'
        onChange={(e) => setTicketName(e.target.value)}
        value={_ticketName}
      />

      <label
        htmlFor='_ticketSymbol'
        className='text-purple-300 hover:text-white trans text-xl'
      >
        Ticket Symbol: <span className='text-purple-600 italic'>(eg. 'TICK')</span>
      </label>
      <Input
        required
        id='_ticketSymbol'
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
