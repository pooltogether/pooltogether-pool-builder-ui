import { MAX_EXIT_FEE_COEFFICIENT } from "lib/constants";

/**
 * @param {*} earlyExitFee a whole number meaning a percentage (ex. 10 -> 10%)
 */
export function calculateMaxExitFeePercentage(earlyExitFee) {
  return earlyExitFee * MAX_EXIT_FEE_COEFFICIENT
}