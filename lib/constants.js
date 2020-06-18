import Kovan from '@pooltogether/pooltogether-contracts/.openzeppelin/kovan.json'

export const SUPPORTED_NETWORKS = [3, 42, 31337, 1234]

export const CONTRACT_ADDRESSES = {
  1: {
    cDai: '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643',
    cUsdc: '0x39aa39c021dfbae8fac545936693ac917d5e7563',
  },
  3: {
    cDai: '0xdb5ed4605c11822811a39f94314fdb8f0fb59a2c',
    cUsdc: '0x8af93cae804cc220d1a608d4fa54d1b6ca5eb361',
    cUsdt: '0x135669c2dcbd63f639582b313883f101a4497f76',
    PPB_CONTRACT_ADDRESS: '0xf17B0054E3BaF89303e5816252f5E608A60f4025',
    SRWPPB_CONTRACT_ADDRESS: '0x9071406f82a32725B327D1f29FCcA06E5d2BD7a0'
  },
  42: {
    cDai: '0xf0d0eb522cfa50b716b3b1604c4f0fa6f04376ad',
    cUsdc: '0x4a92e71227d294f041bd82dd8f78591b75140d63',
    cUsdt: '0x3f0a0ea2f86bae6362cf9799b523ba06647da018',
    PPB_CONTRACT_ADDRESS: Kovan.proxies['PoolTogether3/PrizePoolBuilder'][0].address,
    SRWPPB_CONTRACT_ADDRESS: Kovan.proxies['PoolTogether3/SingleRandomWinnerPrizePoolBuilder'][0].address
  },
  31337: {
    cDai: '0x8858eeB3DfffA017D4BCE9801D340D36Cf895CCf',
    cUsdc: '0x8858eeB3DfffA017D4BCE9801D340D36Cf895CCf',
    cUsdt: '0x8858eeB3DfffA017D4BCE9801D340D36Cf895CCf',
    PPB_CONTRACT_ADDRESS: '0xd15468525c35BDBC1eD8F2e09A00F8a173437f2f',
    SRWPPB_CONTRACT_ADDRESS: '0x5bcb88A0d20426e451332eE6C4324b0e663c50E0'
  },
}
