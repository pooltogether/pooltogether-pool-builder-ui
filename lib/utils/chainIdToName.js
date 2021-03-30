export function chainIdToName(chainId) {
  switch (chainId) {
    case 1:
      return 'mainnet'
    case 3:
      return 'ropsten'
    case 4:
      return 'rinkeby'
    case 42:
      return 'kovan'
    case 56:
      return 'bsc'
    case 77:
      return 'poa-sokol'
    case 97:
      return 'bsc-testnet'
    case 99:
      return 'poa'
    case 100:
      return 'xdai'
    case 137:
      return 'matic'
    case 80001:
      return 'mumbai'
    case 1234:
      return 'localhost'
    case 31337:
      return 'localhost'
    default:
      return 'unknown network'
  }
}
