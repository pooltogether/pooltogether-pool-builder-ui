import CompoundPrizePoolBuilderRopsten from '@pooltogether/pooltogether-contracts/deployments/ropsten/CompoundPrizePoolBuilder.json'
import CompoundPrizePoolBuilderRinkeby from '@pooltogether/pooltogether-contracts/deployments/rinkeby/CompoundPrizePoolBuilder.json'
import CompoundPrizePoolBuilderKovan from '@pooltogether/pooltogether-contracts/deployments/kovan/CompoundPrizePoolBuilder.json'

import RNGBlockhashRopsten from '@pooltogether/pooltogether-rng-contracts/deployments/ropsten/RNGBlockhash.json'
import RNGChainlinkRopsten from '@pooltogether/pooltogether-rng-contracts/deployments/ropsten/RNGChainlink.json'

import RNGBlockhashRinkeby from '@pooltogether/pooltogether-rng-contracts/deployments/rinkeby/RNGBlockhash.json'
import RNGChainlinkRinkeby from '@pooltogether/pooltogether-rng-contracts/deployments/rinkeby/RNGChainlink.json'

import RNGBlockhashKovan from '@pooltogether/pooltogether-rng-contracts/deployments/kovan/RNGBlockhash.json'
import RNGChainlinkKovan from '@pooltogether/pooltogether-rng-contracts/deployments/kovan/RNGChainlink.json'

export const SUPPORTED_NETWORKS = [3, 4, 42, 31337, 1234]

export const CONTRACT_ADDRESSES = {
  1: {
    cDai: '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643',
    cUsdc: '0x39AA39c021dfbaE8faC545936693aC917d5E7563',
    cUsdt: '0xf650C3d88D12dB855b8bf7D11Be6C55A4e07dCC9',
    cBat: '0x6c8c6b02e7b2be14d4fa6022dfd6d75921d90e4e',
    cWbtc: '0xc11b1268c1a384e55c48c2391d8d480264a3a7f4',
    cZrx: '0xb3319f5d18bc0d84dd1b4825dcde5d5f7266d407',
    // COMPOUND_PRIZE_POOL_BUILDER: CompoundPrizePoolBuilderMainnet.address,
    // RNG_SERVICE: {
    //   blockhash: RNGBlockhashMainnet.address,
    //   chainlink: RNGChainlinkMainnet.address,
    // },
  },
  3: {
    cDai: '0xdb5Ed4605C11822811a39F94314fDb8F0fb59A2C',
    cUsdc: '0x8aF93cae804cC220D1A608d4FA54D1b6ca5EB361',
    cUsdt: '0x135669c2dcBd63F639582b313883F101a4497F76',
    cBat: '0x9e95c0b2412ce50c37a121622308e7a6177f819d',
    cWbtc: '0x58145bc5407d63daf226e4870beeb744c588f149',
    cZrx: '0x00e02a5200ce3d5b5743f5369deb897946c88121',
    COMPOUND_PRIZE_POOL_BUILDER: CompoundPrizePoolBuilderRopsten.address,
    RNG_SERVICE: {
      blockhash: RNGBlockhashRopsten.address,
      chainlink: RNGChainlinkRopsten.address,
    },
  },
  4: {
    cDai: '0x6D7F0754FFeb405d23C51CE938289d4835bE3b14',
    cUsdc: '0x5B281A6DdA0B271e91ae35DE655Ad301C976edb1',
    cUsdt: '0x2fB298BDbeF468638AD6653FF8376575ea41e768',
    cBat: '0xebf1a11532b93a529b5bc942b4baa98647913002',
    cWbtc: '0x0014f450b8ae7708593f4a46f8fa6e5d50620f96',
    cZrx: '0x52201ff1720134bbbbb2f6bc97bf3715490ec19b',
    COMPOUND_PRIZE_POOL_BUILDER: CompoundPrizePoolBuilderRinkeby.address,
    RNG_SERVICE: {
      blockhash: RNGBlockhashRinkeby.address,
      chainlink: RNGChainlinkRinkeby.address,
    },
  },
  42: {
    cDai: '0xF0d0EB522cfa50B716B3b1604C4F0fA6f04376AD',
    cUsdc: '0x4a92E71227D294F041BD82dd8f78591B75140d63',
    cUsdt: '0x3f0A0EA2f86baE6362CF9799B523BA06647Da018',
    cBat: '0x4a77faee9650b09849ff459ea1476eab01606c7a',
    cWbtc: '0xa1faa15655b0e7b6b6470ed3d096390e6ad93abb',
    cZrx: '0xaf45ae737514c8427d373d50cd979a242ec59e5a',
    COMPOUND_PRIZE_POOL_BUILDER: CompoundPrizePoolBuilderKovan.address,
    RNG_SERVICE: {
      blockhash: RNGBlockhashKovan.address,
      chainlink: RNGChainlinkKovan.address,
    },
  },
  31337: {
    cDai: '0x1d80315fac6aBd3EfeEbE97dEc44461ba7556160',
    cUsdc: '0x8858eeB3DfffA017D4BCE9801D340D36Cf895CCf',
    cUsdt: '0x8858eeB3DfffA017D4BCE9801D340D36Cf895CCf',
    cBat: '0x8858eeB3DfffA017D4BCE9801D340D36Cf895CCf',
    cWbtc: '0x8858eeB3DfffA017D4BCE9801D340D36Cf895CCf',
    cZrx: '0x8858eeB3DfffA017D4BCE9801D340D36Cf895CCf',
    COMPOUND_PRIZE_POOL_BUILDER: '0xEcc0a6dbC0bb4D51E4F84A315a9e5B0438cAD4f0', 
    RNG_SERVICE: {
      blockhash: '0xEcc0a6dbC0bb4D51E4F84A315a9e5B0438cAD4f0', 
      chainlink: '0xEcc0a6dbC0bb4D51E4F84A315a9e5B0438cAD4f0', 
    },
  },
}
