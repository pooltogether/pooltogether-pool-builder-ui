import CompoundPrizePoolBuilderRopsten from '@pooltogether/pooltogether-contracts/deployments/ropsten/CompoundPrizePoolBuilder.json'
import CompoundPrizePoolBuilderRinkeby from '@pooltogether/pooltogether-contracts/deployments/rinkeby/CompoundPrizePoolBuilder.json'
import CompoundPrizePoolBuilderKovan from '@pooltogether/pooltogether-contracts/deployments/kovan/CompoundPrizePoolBuilder.json'

import SingleRandomWinnerBuilderRopsten from '@pooltogether/pooltogether-contracts/deployments/ropsten/SingleRandomWinnerBuilder.json'
import SingleRandomWinnerBuilderRinkeby from '@pooltogether/pooltogether-contracts/deployments/rinkeby/SingleRandomWinnerBuilder.json'
import SingleRandomWinnerBuilderKovan from '@pooltogether/pooltogether-contracts/deployments/kovan/SingleRandomWinnerBuilder.json'

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
    cBat: '0x6C8c6b02E7b2BE14d4fA6022Dfd6d75921D90E4E',
    cWbtc: '0xC11b1268C1A384e55C48c2391d8d480264A3A7F4',
    cZrx: '0xB3319f5D18Bc0D84dD1b4825Dcde5d5f7266d407',
    // COMPOUND_PRIZE_POOL_BUILDER: CompoundPrizePoolBuilderMainnet.address,
    // SINGLE_RANDOM_WINNER_BUILDER: SingleRandomWinnerBuilderMainnet.address,
    // RNG_SERVICE: {
    //   blockhash: RNGBlockhashMainnet.address,
    //   chainlink: RNGChainlinkMainnet.address,
    // },
  },
  3: {
    cDai: '0xdb5Ed4605C11822811a39F94314fDb8F0fb59A2C',
    cUsdc: '0x8aF93cae804cC220D1A608d4FA54D1b6ca5EB361',
    cUsdt: '0x135669c2dcBd63F639582b313883F101a4497F76',
    cBat: '0x9E95c0b2412cE50C37a121622308e7a6177F819D',
    cWbtc: '0x58145Bc5407D63dAF226e4870beeb744C588f149',
    cZrx: '0x00e02a5200CE3D5b5743F5369Deb897946C88121',
    COMPOUND_PRIZE_POOL_BUILDER: CompoundPrizePoolBuilderRopsten.address,
    SINGLE_RANDOM_WINNER_BUILDER: SingleRandomWinnerBuilderRopsten.address,
    RNG_SERVICE: {
      blockhash: RNGBlockhashRopsten.address,
      chainlink: RNGChainlinkRopsten.address,
    },
  },
  4: {
    cDai: '0x6D7F0754FFeb405d23C51CE938289d4835bE3b14',
    cUsdc: '0x5B281A6DdA0B271e91ae35DE655Ad301C976edb1',
    cUsdt: '0x2fB298BDbeF468638AD6653FF8376575ea41e768',
    cBat: '0xEBf1A11532b93a529b5bC942B4bAA98647913002',
    cWbtc: '0x0014F450B8Ae7708593F4A46F8fa6E5D50620F96',
    cZrx: '0x52201ff1720134bBbBB2f6BC97Bf3715490EC19B',
    COMPOUND_PRIZE_POOL_BUILDER: CompoundPrizePoolBuilderRinkeby.address,
    SINGLE_RANDOM_WINNER_BUILDER: SingleRandomWinnerBuilderRinkeby.address,
    RNG_SERVICE: {
      blockhash: RNGBlockhashRinkeby.address,
      chainlink: RNGChainlinkRinkeby.address,
    },
  },
  42: {
    cDai: '0xF0d0EB522cfa50B716B3b1604C4F0fA6f04376AD',
    cUsdc: '0x4a92E71227D294F041BD82dd8f78591B75140d63',
    cUsdt: '0x3f0A0EA2f86baE6362CF9799B523BA06647Da018',
    cBat: '0x4a77fAeE9650b09849Ff459eA1476eaB01606C7a',
    cWbtc: '0xa1fAA15655B0e7b6B6470ED3d096390e6aD93Abb',
    cZrx: '0xAf45ae737514C8427D373D50Cd979a242eC59e5a',
    COMPOUND_PRIZE_POOL_BUILDER: CompoundPrizePoolBuilderKovan.address,
    SINGLE_RANDOM_WINNER_BUILDER: SingleRandomWinnerBuilderKovan.address,
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
    SINGLE_RANDOM_WINNER_BUILDER: '',
    RNG_SERVICE: {
      blockhash: '0xEcc0a6dbC0bb4D51E4F84A315a9e5B0438cAD4f0',
      chainlink: '0xEcc0a6dbC0bb4D51E4F84A315a9e5B0438cAD4f0',
    },
  },
}
