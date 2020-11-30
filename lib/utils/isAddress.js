import { ethers } from 'ethers'

export function isAddress(address) {
  try {
    ethers.utils.getAddress(address)
  } catch (e) {
    return false
  }
  return true
}
