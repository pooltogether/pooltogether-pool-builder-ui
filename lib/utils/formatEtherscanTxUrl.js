export function formatEtherscanTxUrl(hash, chainId) {
  var baseUrl
  switch (chainId) {
    case 3:
      baseUrl = `https://ropsten.etherscan.io/tx/${hash}`
      break
    case 4:
      baseUrl = `https://rinkeby.etherscan.io/tx/${hash}`
      break
    case 42:
      baseUrl = `https://kovan.etherscan.io/tx/${hash}`
      break
    case 77:
      baseUrl = `https://blockscout.com/poa/sokol/tx/${hash}`
      break
    case 99:
      baseUrl = `https://blockscout.com/poa/xdai/tx/${hash}`
      break
    default:
      baseUrl = `https://etherscan.io/tx/${hash}`
      break
  }
  return baseUrl
}
