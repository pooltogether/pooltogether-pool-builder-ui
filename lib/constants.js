import Kovan from '@pooltogether/pooltogether-contracts/.openzeppelin/kovan.json'
// import Ropsten from '@pooltogether/pooltogether-contracts/.openzeppelin/ropsten.json'

export const SUPPORTED_NETWORKS = [3, 42, 31337, 1234]

export const CONTRACT_ADDRESSES = {
  1: {
    cDai: '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643',
    cUsdc: '0x39AA39c021dfbaE8faC545936693aC917d5E7563',
  },
  3: {
    cDai: '0xdb5Ed4605C11822811a39F94314fDb8F0fb59A2C',
    cUsdc: '0x8aF93cae804cC220D1A608d4FA54D1b6ca5EB361',
    cUsdt: '0x135669c2dcBd63F639582b313883F101a4497F76',
    // PRIZE_STRATEGY_BUILDER: Ropsten.proxies['PoolTogether3/PrizeStrategyBuilder'][0].address,
  },
  42: {
    cDai: '0xF0d0EB522cfa50B716B3b1604C4F0fA6f04376AD',
    cUsdc: '0x4a92E71227D294F041BD82dd8f78591B75140d63',
    cUsdt: '0x3f0A0EA2f86baE6362CF9799B523BA06647Da018',
    PRIZE_STRATEGY_BUILDER: Kovan.proxies['PoolTogether3/PrizeStrategyBuilder'][0].address,
  },
  31337: {
    cDai: '0x1d80315fac6aBd3EfeEbE97dEc44461ba7556160',
    cUsdc: '0x8858eeB3DfffA017D4BCE9801D340D36Cf895CCf',
    cUsdt: '0x8858eeB3DfffA017D4BCE9801D340D36Cf895CCf',
    PRIZE_STRATEGY_BUILDER: '0xEcc0a6dbC0bb4D51E4F84A315a9e5B0438cAD4f0',
  },
}
