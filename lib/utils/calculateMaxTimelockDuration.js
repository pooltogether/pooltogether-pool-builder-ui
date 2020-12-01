import { MAX_TIMELOCK_DURATION_COEFFICIENT } from 'lib/constants'

/**
 * @param {*} prizePeriod as a number of days
 */
export function calculateMaxTimelockDuration(prizePeriod) {
  return prizePeriod * MAX_TIMELOCK_DURATION_COEFFICIENT
}
