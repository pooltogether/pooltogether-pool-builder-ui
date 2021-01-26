import React from 'react'
import {
  TextInputGroup,
  TextInputGroupType,
  InputLabel,
  Card
} from '@pooltogether/pooltogether-react-tailwind-ui'


export const NumberOfWinnersCard = (props) => {
  const { setNumberOfWinners, numberOfWinners } = props

  return (
    <Card>
      <InputLabel
        primary='Number of Winners'
        description='The prize will be split between the selected number of winners.'
      >
        <TextInputGroup
          id='_numberOfWiners'
          containerClassName='w-full sm:w-1/2 sm:ml-2'
          label='Number of winners'
          required
          type={TextInputGroupType.number}
          max={10}
          min={1}
          step={1}
          onChange={(e) => {
            setNumberOfWinners(e.target.value)
          }}
          value={numberOfWinners}
          unit=''
        />
      </InputLabel>
    </Card>
  )
}
