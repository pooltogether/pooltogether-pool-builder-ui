import React from 'react'

import { Button } from 'lib/components/Button'
import { Input } from 'lib/components/Input'

export const SRWPPBForm = (props) => {
  const {
    handleSubmit,
    vars,
    stateSetters,
  } = props

  const {
    cToken,
    prizePeriodInSeconds,
    _collateralName,
    _collateralSymbol,
    _ticketName,
    _ticketSymbol,
  } = vars

  const {
    setCToken,
    setPrizePeriodInSeconds,
    setCollateralName,
    setCollateralSymbol,
    setTicketName,
    setTicketSymbol,
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
        SRW Pool Parameters:
      </div>

      <label
        htmlFor='prizePeriodInSeconds'
        className='text-purple-300 hover:text-white trans mt-0'
      >cToken to Use:</label>
      <div
        className='inputGroup w-full sm:w-10/12 text-base sm:text-xl lg:text-2xl'
      >
        <input
          id='cDai-radio'
          name='radio'
          type='radio'
          onChange={handleTickerChange}
          value='cDai'
          checked={cToken === 'cDai'}
        />
        <label
          htmlFor='cDai-radio'
          className='text-purple-300 relative pl-6 py-3'
        >cDai</label>
      </div>
      <div
        className='inputGroup w-full sm:w-10/12 text-base sm:text-xl lg:text-2xl'
      >
        <input
          id='cUsdc-radio'
          name='radio'
          type='radio'
          value='cUsdc'
          onChange={handleTickerChange}
          checked={cToken === 'cUsdc'}
        />
        <label
          htmlFor='cUsdc-radio'
          className='text-purple-300 relative pl-6 py-3'
        >cUsdc</label>
      </div>

      <label
        htmlFor='prizePeriodInSeconds'
        className='text-purple-300 hover:text-white trans'
      >
        Prize period <span className='text-purple-600 italic'> (in seconds)</span>
      </label>
      <Input
        id='prizePeriodInSeconds'
        required
        autoFocus
        type='number'
        pattern='\d+'
        onChange={(e) => setPrizePeriodInSeconds(e.target.value)}
        value={prizePeriodInSeconds}
      />

      <label
        htmlFor='_collateralName'
        className='text-purple-300 hover:text-white trans'
      >
        Collateral Name: <span className='text-purple-600 italic'>(eg. 'Sponsorship')</span>
      </label>
      <Input
        required
        id='_collateralName'
        onChange={(e) => setCollateralName(e.target.value)}
        value={_collateralName}
      />



      <label
        htmlFor='_collateralSymbol'
        className='text-purple-300 hover:text-white trans'
      >
        Collateral Name: <span className='text-purple-600 italic'>(eg. 'SPON')</span>
      </label>
      <Input
        required
        id='_collateralSymbol'
        onChange={(e) => setCollateralSymbol(e.target.value)}
        value={_collateralSymbol}
      />


      <label
        htmlFor='_ticketName'
        className='text-purple-300 hover:text-white trans'
      >
        Collateral Name: <span className='text-purple-600 italic'>(eg. 'Ticket')</span>
      </label>
      <Input
        required
        id='_ticketName'
        onChange={(e) => setTicketName(e.target.value)}
        value={_ticketName}
      />

      <label
        htmlFor='_ticketSymbol'
        className='text-purple-300 hover:text-white trans'
      >
        Collateral Name: <span className='text-purple-600 italic'>(eg. 'TICK')</span>
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
          Create SRW Pool          
        </Button>
      </div>
    </form>
  </>
}
