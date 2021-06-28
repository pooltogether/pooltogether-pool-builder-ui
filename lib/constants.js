import PoolWithMultipleWinnersBuilderMainnet from '@pooltogether/pooltogether-contracts/deployments/mainnet/PoolWithMultipleWinnersBuilder.json'
import PoolWithMultipleWinnersBuilderRinkeby from '@pooltogether/pooltogether-contracts/deployments/rinkeby/PoolWithMultipleWinnersBuilder.json'
import PoolWithMultipleWinnersBuilderSokol from '@pooltogether/pooltogether-contracts/deployments/poaSokol/PoolWithMultipleWinnersBuilder.json'
import PoolWithMultipleWinnersBuilderMatic from '@pooltogether/pooltogether-contracts/deployments/matic/PoolWithMultipleWinnersBuilder.json'
import PoolWithMultipleWinnersBuilderKovan from '@pooltogether/pooltogether-contracts/deployments/kovan/PoolWithMultipleWinnersBuilder.json'
import PoolWithMultipleWinnersBuilderMumbai from '@pooltogether/pooltogether-contracts/deployments/mumbai/PoolWithMultipleWinnersBuilder.json'
import PoolWithMultipleWinnersBuilderXDai from '@pooltogether/pooltogether-contracts/deployments/xdai/PoolWithMultipleWinnersBuilder.json'
import PoolWithMultipleWinnersBuilderBsc from '@pooltogether/pooltogether-contracts/deployments/bsc/PoolWithMultipleWinnersBuilder.json'
import PoolWithMultipleWinnersBuilderBscTestnet from '@pooltogether/pooltogether-contracts/deployments/bscTestnet/PoolWithMultipleWinnersBuilder.json'

import RNGBlockhashMainnet from '@pooltogether/pooltogether-rng-contracts/deployments/mainnet/RNGBlockhash.json'
import RNGBlockhashRinkeby from '@pooltogether/pooltogether-rng-contracts/deployments/rinkeby/RNGBlockhash.json'
import RNGBlockhashSokol from '@pooltogether/pooltogether-rng-contracts/deployments/poaSokol_77/RNGBlockhash.json'
import RNGBlockhashKovan from '@pooltogether/pooltogether-rng-contracts/deployments/kovan/RNGBlockhash.json'
import RNGBlockhashXDai from '@pooltogether/pooltogether-rng-contracts/deployments/xdai_100/RNGBlockhash.json'
import RNGBlockhashMatic from '@pooltogether/pooltogether-rng-contracts/deployments/matic_137/RNGBlockhash.json'
import RNGBlockhashBsc from '@pooltogether/pooltogether-rng-contracts/deployments/bsc_56/RNGBlockhash.json'
import RNGBlockhashBscTestnet from '@pooltogether/pooltogether-rng-contracts/deployments/bscTestnet_97/RNGBlockhash.json'

import RNGChainlinkMainnet from '@pooltogether/pooltogether-rng-contracts/deployments/mainnet/RNGChainlink.json'
import RNGChainlinkRinkeby from '@pooltogether/pooltogether-rng-contracts/deployments/rinkeby/RNGChainlink.json'
import RNGChainlinkKovan from '@pooltogether/pooltogether-rng-contracts/deployments/kovan/RNGChainlink.json'
// import RNGChainlinkBsc from '@pooltogether/pooltogether-rng-contracts/deployments/bsc/RNGChainlink.json'
// import RNGChainlinkBscTestnet from '@pooltogether/pooltogether-rng-contracts/deployments/bscTestnet/RNGChainlink.json'

export const TICKET_DECIMALS = '18'

export const DEFAULT_TOKEN_PRECISION = 18

export const ETHEREUM_NETWORKS = [1, 3, 4, 5, 42]
export const SUPPORTED_NETWORKS = [1, 4, 42, 56, 77, 97, 100, 137, 31337, 80001]

export const CONTRACT_ADDRESSES = {
  1: {
    POOL_WITH_MULTIPLE_WINNERS_BUILDER: PoolWithMultipleWinnersBuilderMainnet.address,
    RNG_SERVICE: {
      blockhash: RNGBlockhashMainnet.address,
      chainlink: RNGChainlinkMainnet.address
    }
  },
  4: {
    POOL_WITH_MULTIPLE_WINNERS_BUILDER: PoolWithMultipleWinnersBuilderRinkeby.address,
    RNG_SERVICE: {
      blockhash: RNGBlockhashRinkeby.address,
      chainlink: RNGChainlinkRinkeby.address
    }
  },
  42: {
    POOL_WITH_MULTIPLE_WINNERS_BUILDER: PoolWithMultipleWinnersBuilderKovan.address,
    RNG_SERVICE: {
      blockhash: RNGBlockhashKovan.address,
      chainlink: RNGChainlinkKovan.address
    }
  },
  56: {
    POOL_WITH_MULTIPLE_WINNERS_BUILDER: PoolWithMultipleWinnersBuilderBsc.address,
    RNG_SERVICE: {
      blockhash: RNGBlockhashBsc.address
      // chainlink: RNGChainlinkBsc.address
    }
  },
  77: {
    POOL_WITH_MULTIPLE_WINNERS_BUILDER: PoolWithMultipleWinnersBuilderSokol.address,
    RNG_SERVICE: {
      blockhash: RNGBlockhashSokol.address
    }
  },
  97: {
    POOL_WITH_MULTIPLE_WINNERS_BUILDER: PoolWithMultipleWinnersBuilderBscTestnet.address,
    RNG_SERVICE: {
      blockhash: RNGBlockhashBscTestnet.address
      // chainlink: RNGChainlinkBscTestnet.address
    }
  },
  100: {
    POOL_WITH_MULTIPLE_WINNERS_BUILDER: PoolWithMultipleWinnersBuilderXDai.address,
    RNG_SERVICE: {
      blockhash: RNGBlockhashXDai.address
    }
  },
  137: {
    POOL_WITH_MULTIPLE_WINNERS_BUILDER: PoolWithMultipleWinnersBuilderMatic.address,
    RNG_SERVICE: {
      blockhash: RNGBlockhashMatic.address
    }
  },
  80001: {
    POOL_WITH_MULTIPLE_WINNERS_BUILDER: PoolWithMultipleWinnersBuilderMumbai.address,
    RNG_SERVICE: {}
  },
  31337: {
    POOL_WITH_MULTIPLE_WINNERS_BUILDER: PoolWithMultipleWinnersBuilderMainnet.address,
    RNG_SERVICE: {
      blockhash: RNGBlockhashMainnet.address,
      chainlink: RNGChainlinkMainnet.address
    }
  }
}

export const DEFAULT_INPUT_CLASSES =
  'w-full text-inverse bg-transparent trans focus:outline-none leading-none'
export const DEFAULT_INPUT_LABEL_CLASSES = 'mt-0 mb-1 text-xs sm:text-sm'
export const DEFAULT_INPUT_GROUP_CLASSES = 'trans py-2 px-5 sm:py-4 sm:px-10 bg-body'

export const MAX_EXIT_FEE_PERCENTAGE = 10
export const MAX_TIMELOCK_DURATION_COEFFICIENT = 4
export const FEE_DECAY_DURATION_COEFFICIENT = 2

// Cookie strings
export const SELECTED_WALLET_COOKIE_KEY = 'selectedWallet'

// Min decimal for day inputs to allow minutes (0.0001 ≈ 8 seconds)
export const DAYS_STEP = 0.0001

export const NETWORKS = {
  'ropsten': {
    value: 'ropsten',
    view: 'Ropsten'
  },
  'rinkeby': {
    value: 'rinkeby',
    view: 'Rinkeby'
  },
  'mainnet': {
    value: 'mainnet',
    view: 'Mainnet'
  },
  'kovan': {
    value: 'kovan',
    view: 'Kovan'
  },
  'poa-sokol': {
    value: 'poa-sokol',
    view: 'Sokol (POA)'
  },
  'xdai': {
    value: 'xdai',
    view: 'xDai'
  },
  'matic': {
    value: 'matic',
    view: 'Matic'
  },
  'mumbai': {
    value: 'mumbai',
    view: 'Mumbai (Matic)'
  },
  'bsc': {
    value: 'bsc',
    view: 'Binance Smart Chain (BSC)'
  },
  'bsc-testnet': {
    value: 'bsc-testnet',
    view: 'Binance Smart Chain Testnet'
  },
  'local': {
    value: 'local',
    view: 'Local'
  }
}
