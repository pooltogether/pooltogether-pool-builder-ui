import React from 'react'
import { Card } from 'lib/components/Card'
import { InputLabel } from 'lib/components/InputLabel'
import { TextInputGroup, TextInputGroupType } from 'lib/components/TextInputGroup'
import { DropdownInputGroup } from 'lib/components/DropdownInputGroup'
import useCounter from 'lib/hooks/useCounter'
import { constants } from 'ethers'
import { Button } from './Button'

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

  const handleRemovePrizeSplit = (index) => {
    if (index == 1) {
      setPrizePool1Target(constants.AddressZero)
      setPrizePool1Percentage(undefined)
      setPrizePool1TokenType(undefined)
    } else {
      setPrizePool2Target(constants.AddressZero)
      setPrizePool2Percentage(undefined)
      setPrizePool2TokenType(undefined)
    }
    counter.decr(1)
  }

  return (
    <Card>
      <InputLabel
        primary='Prize Split'
        description='Distribute a percentage of prize (before awarding winners) on every draw to static address.'
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

      <div className='flex items-center mt-4'>
        <Button
          disabled={counter.value == 2}
          color='primary'
          size='sm'
          paddingClasses='p-2'
          onClick={() => counter.incr(1)}
        >
          Add prize split
        </Button>
        <Button
          disabled={counter.value == 0}
          color='warning'
          size='sm'
          className='ml-2'
          paddingClasses='p-2'
          onClick={() => handleRemovePrizeSplit(counter.value)}
        >
          Remove prize split
        </Button>
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
          label='Recipient'
          required
          type={TextInputGroupType.text}
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
