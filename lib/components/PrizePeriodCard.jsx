import React, { useState } from 'react'

import { Card } from 'lib/components/Card'
import { InputLabel } from 'lib/components/InputLabel'
import { TextInputGroup, TextInputGroupType } from 'lib/components/TextInputGroup'
import { DAYS_STEP, FEE_DECAY_DURATION_COEFFICIENT } from 'lib/constants'
import { Collapse } from 'lib/components/Collapse'
import { useInterval } from 'lib/hooks/useInterval'

export const PrizePeriodCard = (props) => {
  const {
    userChangedCreditMaturation,
    setCreditMaturationInDays,
    setPrizePeriodInDays,
    prizePeriodInDays,
    prizePeriodStartAt,
    setPrizePeriodStartAt
  } = props

  const [secondsSinceEpoch, setSecondsSinceEpoch] = useState(
    Math.floor(new Date().getTime() / 1000)
  )
  useInterval(() => setSecondsSinceEpoch(secondsSinceEpoch + 1))

  const date =
    prizePeriodStartAt && Number(prizePeriodStartAt)
      ? new Date(Number(prizePeriodStartAt) * 1000)
      : null

  return (
    <Card>
      <InputLabel
        primary='Prize Period'
        description='The period of time until the Prize Strategy awards the payout. This range will repeat indefinitely.'
      >
        <TextInputGroup
          id='_prizePeriodInDays'
          containerClassName='w-full sm:w-1/2'
          label={
            <>
              Prize period <span className='text-default italic'> (in days)</span>
            </>
          }
          required
          type={TextInputGroupType.number}
          min={0}
          step={DAYS_STEP}
          onChange={(e) => {
            if (!userChangedCreditMaturation) {
              setCreditMaturationInDays(e.target.value * FEE_DECAY_DURATION_COEFFICIENT)
            }
            setPrizePeriodInDays(e.target.value)
          }}
          value={prizePeriodInDays}
          unit='days'
        />
      </InputLabel>

      <Collapse title='Advanced Settings' className='mt-4 sm:mt-8'>
        <InputLabel
          secondary='Prize Pool Start Time'
          description={`Provide the unix time stamp of the start time of the first prize period (in seconds). If no number is provided, the first prize period will begin as soon as the prize pool is created.`}
        >
          <div className='flex flex-col sm:flex-row'>
            <TextInputGroup
              id='_startTime'
              containerClassName='w-full sm:w-1/2 sm:mr-4'
              type={TextInputGroupType.number}
              step={1}
              min={secondsSinceEpoch}
              label='Start Time'
              placeholder='1618609964'
              onChange={(e) => {
                setPrizePeriodStartAt(e.target.value)
              }}
              value={prizePeriodStartAt}
              unit='seconds'
            />
            <div className='w-full sm:w-1/2 sm:ml-4 text-accent-1 flex flex-col my-auto'>
              <span className='mb-4'>Current unix time: {secondsSinceEpoch}</span>
              {date && (
                <span>{`Input date: ${date?.toDateString()} ${date?.toLocaleTimeString()}`}</span>
              )}
            </div>
          </div>
        </InputLabel>
      </Collapse>
    </Card>
  )
}
