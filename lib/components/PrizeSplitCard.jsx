import React from 'react'
import { Card } from 'lib/components/Card'
import { InputLabel } from 'lib/components/InputLabel'
import { TextInputGroup, TextInputGroupType } from 'lib/components/TextInputGroup'
import { DropdownInputGroup } from 'lib/components/DropdownInputGroup'
import useCounter from 'lib/hooks/useCounter.ts'

export const PrizeSplitCard = (props) => {
  const {
    prizePool1Target,
    prizePool1Percentage,
    prizePool2Target,
    prizePool2Percentage,
    setPrizePool1Target,
    setPrizePool1TokenType,
    setPrizePool1Percentage,
    setPrizePool2Target,
    setPrizePool2Percentage,
    setPrizePool2TokenType
  } = props
  const counter = useCounter(1, {
    min: 0,
    max: 2
  })

  return (
    <Card>
      <InputLabel
        primary='Prize Split'
        description='The pool owner can decide a fixed percent of the interest accrued on every prize to go to a specific address. You can add up to two additional awards.'
      >
        {(counter.value == 1 || counter.value == 2) && (
          <PrizeSplitPosition
            index={1}
            target={prizePool1Target}
            percentage={prizePool1Percentage}
            setTarget={setPrizePool1Target}
            setPercentage={setPrizePool1Percentage}
            setTokenType={setPrizePool1TokenType}
          />
        )}
        {counter.value == 2 && (
          <PrizeSplitPosition
            index={2}
            target={prizePool2Target}
            percentage={prizePool2Percentage}
            setTarget={setPrizePool2Target}
            setPercentage={setPrizePool2Percentage}
            setTokenType={setPrizePool2TokenType}
          />
        )}
      </InputLabel>

      <div className='flex items-center'>
        <button
          className='font-bold rounded-full text-green-1 border border-green-1 hover:text-white hover:bg-lightPurple-1000 text-xxs sm:text-base mt-4 pt-2 pb-2 px-3 sm:px-6 trans'
          onClick={() => counter.incr(1)}
        >
          Add Additional PrizeSplit
        </button>
        <button
          className='ml-2 font-bold rounded-full text-yellow-2 border border-yellow-2 hover:text-white hover:bg-lightPurple-1000 text-xxs sm:text-base mt-4 pt-2 pb-2 px-3 sm:px-6 trans'
          onClick={() => counter.decr(1)}
        >
          Remove PrizeSplit
        </button>
      </div>
    </Card>
  )
}

const PrizeSplitPosition = (props) => {
  const { target, percentage, tokenType, setTarget, setPercentage, setTokenType, index } = props

  const tokenTypeOptions = {
    0: {
      value: 0,
      label: 'Ticket'
    },
    1: {
      value: 1,
      label: 'Sponsorship'
    }
  }

  const formatValue = (key) => tokenTypeOptions[key].label

  return (
    <>
      <h3 className='font-normal mt-10 mb-5 ml-0 text-xl'>Additional Prize Split {index}</h3>
      <div className='grid grid-cols-5'>
        <TextInputGroup
          id='_prizeSplitRecipient'
          containerClassName='col-span-3 sm:mr-2'
          textClasses={'text-xs'}
          label='Recipient'
          required
          type={TextInputGroupType.text}
          max={10}
          min={1}
          step={1}
          onChange={(e) => {
            setTarget(e.target.value)
          }}
          value={target}
          unit='Ξ Address'
        />
        <TextInputGroup
          id='_prizeSplitPercentage'
          containerClassName='col-span-2 sm:ml-2'
          label='Interest to be deducted for an award'
          required
          type={TextInputGroupType.number}
          max={100}
          min={1}
          step={1}
          onChange={(e) => {
            setPercentage(e.target.value)
          }}
          value={percentage}
          unit='% percent'
        />
      </div>
      <div className=''>
        <DropdownInputGroup
          id='tokenType'
          placeHolder='Token Type'
          label={'Select token type the recipient will receive upon prize split distribution.'}
          formatValue={formatValue}
          onValueSet={setTokenType}
          current={tokenType}
          values={tokenTypeOptions}
        />
      </div>
    </>
  )
}
