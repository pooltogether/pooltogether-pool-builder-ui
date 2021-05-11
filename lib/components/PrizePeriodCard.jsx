import React, { useState } from 'react'
import { SECONDS_PER_WEEK } from '@pooltogether/current-pool-data'

import { Card } from 'lib/components/Card'
import { InputLabel } from 'lib/components/InputLabel'
import { TextInputGroup, TextInputGroupType } from 'lib/components/TextInputGroup'
import { DAYS_STEP, FEE_DECAY_DURATION_COEFFICIENT } from 'lib/constants'
import { Collapse } from 'lib/components/Collapse'
import { useInterval } from 'lib/hooks/useInterval'
import { CopyIcon } from 'lib/components/CopyIcon'

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
              min={secondsSinceEpoch - SECONDS_PER_WEEK}
              label='Start Time'
              placeholder={secondsSinceEpoch}
              onChange={(e) => {
                setPrizePeriodStartAt(e.target.value)
              }}
              value={prizePeriodStartAt}
              unit='seconds'
            />
            <div className='w-full sm:w-1/2 sm:ml-4 text-accent-1 flex flex-col '>
              <span className='mb-1'>
                <span className='font-bold'>Current unix time:</span>{' '}
                <span>{secondsSinceEpoch}</span>
                <CopyIcon className='w-4 h-4 ml-2' text={secondsSinceEpoch} />
              </span>
              {date && (
                <span>
                  <span className='font-bold'>Input date:</span>{' '}
                  <span>
                    {date?.toDateString()}, {date?.toLocaleTimeString()}
                  </span>
                </span>
              )}
            </div>
          </div>
        </InputLabel>
      </Collapse>
    </Card>
  )
}
