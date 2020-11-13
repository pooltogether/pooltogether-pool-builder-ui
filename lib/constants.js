import AavePrizePoolBuilderRopsten from '@pooltogether/pooltogether-contracts/deployments/ropsten/AavePrizePoolBuilder.json'

import CompoundPrizePoolBuilderMainnet from '@pooltogether/pooltogether-contracts/deployments/mainnet/CompoundPrizePoolBuilder.json'
import CompoundPrizePoolBuilderRopsten from '@pooltogether/pooltogether-contracts/deployments/ropsten/CompoundPrizePoolBuilder.json'
import CompoundPrizePoolBuilderRinkeby from '@pooltogether/pooltogether-contracts/deployments/rinkeby/CompoundPrizePoolBuilder.json'

import SingleRandomWinnerBuilderMainnet from '@pooltogether/pooltogether-contracts/deployments/mainnet/SingleRandomWinnerBuilder.json'
import SingleRandomWinnerBuilderRopsten from '@pooltogether/pooltogether-contracts/deployments/ropsten/SingleRandomWinnerBuilder.json'
import SingleRandomWinnerBuilderRinkeby from '@pooltogether/pooltogether-contracts/deployments/rinkeby/SingleRandomWinnerBuilder.json'

import RNGBlockhashMainnet from '@pooltogether/pooltogether-rng-contracts/deployments/mainnet/RNGBlockhash.json'
import RNGBlockhashRopsten from '@pooltogether/pooltogether-rng-contracts/deployments/ropsten/RNGBlockhash.json'
import RNGBlockhashRinkeby from '@pooltogether/pooltogether-rng-contracts/deployments/rinkeby/RNGBlockhash.json'

import RNGChainlinkMainnet from '@pooltogether/pooltogether-rng-contracts/deployments/mainnet/RNGChainlink.json'
import RNGChainlinkRinkeby from '@pooltogether/pooltogether-rng-contracts/deployments/rinkeby/RNGChainlink.json'

export const TICKET_DECIMALS = '18'

export const SUPPORTED_NETWORKS = [1, 3, 4, 31337, 1234]

export const CONTRACT_ADDRESSES = {
  1: {
    cDai: '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643',
    cUsdc: '0x39AA39c021dfbaE8faC545936693aC917d5E7563',
    cUsdt: '0xf650C3d88D12dB855b8bf7D11Be6C55A4e07dCC9',
    cBat: '0x6C8c6b02E7b2BE14d4fA6022Dfd6d75921D90E4E',
    cWbtc: '0xC11b1268C1A384e55C48c2391d8d480264A3A7F4',
    cZrx: '0xB3319f5D18Bc0D84dD1b4825Dcde5d5f7266d407',
    COMPOUND_PRIZE_POOL_BUILDER: CompoundPrizePoolBuilderMainnet.address,
    SINGLE_RANDOM_WINNER_BUILDER: SingleRandomWinnerBuilderMainnet.address,
    RNG_SERVICE: {
      blockhash: RNGBlockhashMainnet.address,
      chainlink: RNGChainlinkMainnet.address,
    },
  },
  3: {
    aBat: '0x0D0Ff1C81F2Fbc8cbafA8Df4bF668f5ba963Dab4',
    aDai: '0xcB1Fe6F440c49E9290c3eb7f158534c2dC374201',
    aEth: '0x2433A1b6FcF156956599280C3Eb1863247CFE675',
    aKnc: '0xCf6efd4528d27Df440fdd585a116D3c1fC5aDdEe',
    aLend: '0x383261d0e287f0A641322AEB15E3da50147Dd36b',
    aLink: '0x52fd99c15e6FFf8D4CF1B83b2263a501FDd78973',
    aMana: '0x8e96a4068da80F66ef1CFc7987f0F834c26106fa',
    aMkr: '0xEd6A5d671f7c55aa029cbAEa2e5E9A18E9d6a1CE',
    aRep: '0xE4B92BcDB2f972e1ccc069D4dB33d5f6363738dE',
    // aSnx: '0xb4D480f963f4F685F1D51d2B6159D126658B1dA8', Not on Ropsten yet
    aSusd: '0x5D17e0ea2d886F865E40176D71dbc0b59a54d8c1',
    aTusd: '0x9265d51F5ABf1E23bE64418827859bc83ae70a57',
    aUsdc: '0x2dB6a31f973Ec26F5e17895f0741BB5965d5Ae15',
    aUsdt: '0x790744bC4257B4a0519a3C5649Ac1d16DDaFAE0D',
    aWbtc: '0xA1c4dB01F8344eCb11219714706C82f0c0c64841',
    aZrx: '0x5BDC773c9D3515a5e3Dd415428F92a90E8e63Ae4',
    AAVE_PRIZE_POOL_BUILDER: AavePrizePoolBuilderRopsten.address,
    cDai: '0xdb5Ed4605C11822811a39F94314fDb8F0fb59A2C',
    cUsdc: '0x8aF93cae804cC220D1A608d4FA54D1b6ca5EB361',
    cUsdt: '0x135669c2dcBd63F639582b313883F101a4497F76',
    cBat: '0x9E95c0b2412cE50C37a121622308e7a6177F819D',
    cWbtc: '0x58145Bc5407D63dAF226e4870beeb744C588f149',
    cZrx: '0x00e02a5200CE3D5b5743F5369Deb897946C88121',
    COMPOUND_PRIZE_POOL_BUILDER: CompoundPrizePoolBuilderRopsten.address,
    SINGLE_RANDOM_WINNER_BUILDER: SingleRandomWinnerBuilderRopsten.address,
    RNG_SERVICE: {
      blockhash: RNGBlockhashRopsten.address
    }
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
      chainlink: RNGChainlinkRinkeby.address
    }
  },
  // Mainnet fork
  // 1: {
  //   aBat: '0xE1BA0FB44CCb0D11b80F92f4f8Ed94CA3fF51D00',
  //   aDai: '0xfC1E690f61EFd961294b3e1Ce3313fBD8aa4f85d',
  //   aEth: '0x3a3A65aAb0dd2A17E3F1947bA16138cd37d08c04',
  //   aKnc: '0x9D91BE44C06d373a8a226E1f3b146956083803eB',
  //   aLend: '0x7D2D3688Df45Ce7C552E19c27e007673da9204B8',
  //   aLink: '0xA64BD6C70Cb9051F6A9ba1F163Fdc07E0DfB5F84',
  //   aMana: '0x6FCE4A401B6B80ACe52baAefE4421Bd188e76F6f',
  //   aMkr: '0x7deB5e830be29F91E298ba5FF1356BB7f8146998',
  //   aRep: '0x71010A9D003445aC60C4e6A7017c1E89A477B438',
  //   aSnx: '0x328C4c80BC7aCa0834Db37e6600A6c49E12Da4DE',
  //   aSusd: '0x625aE63000f46200499120B906716420bd059240',
  //   aTusd: '0x4DA9b813057D04BAef4e5800E36083717b4a0341',
  //   aUsdc: '0x9bA00D6856a4eDF4665BcA2C2309936572473B7E',
  //   aUsdt: '0x71fc860F7D3A592A4a98740e39dB31d25db65ae8',
  //   aWbtc: '0xFC4B8ED459e00e5400be803A9BB3954234FD50e3',
  //   aYfi: '0x12e51E77DAAA58aA0E9247db7510Ea4B46F9bEAd',
  //   aZrx: '0x6Fb0855c404E09c47C3fBCA25f08d4E41f9F062f',
  //   AAVE_PRIZE_POOL_BUILDER: '0xf0b4B9068b6D75FA7fccdb284A4609CA7f45A702',
  //   cDai: '0x7b36f452f13f897eC1CCBe660A64971B6095f666',
  //   cUsdc: '0x7b36f452f13f897eC1CCBe660A64971B6095f666',
  //   cUsdt: '0x7b36f452f13f897eC1CCBe660A64971B6095f666',
  //   cBat: '0x7b36f452f13f897eC1CCBe660A64971B6095f666',
  //   cWbtc: '0x7b36f452f13f897eC1CCBe660A64971B6095f666',
  //   cZrx: '0x7b36f452f13f897eC1CCBe660A64971B6095f666',
  //   COMPOUND_PRIZE_POOL_BUILDER: '0xf0b4B9068b6D75FA7fccdb284A4609CA7f45A702',
  //   SINGLE_RANDOM_WINNER_BUILDER: '0x267DEC85e719d56B79080D3b27929B3cAB6af581',
  //   TWO_WINNERS_BUILDER: '0xb38e46EBf90888D621Cde5661D3cC2476d7bCc2e',
  //   RNG_SERVICE: {
  //     blockhash: '0x08E2fAD7d06f14136a7b6854ee54B4c6A60c5B33',
  //     chainlink: '0x2aeB429f7d8c00983E033087Dd5a363AbA2AC55f'
  //   }
  // }
  31337: {
    aDai: '0x7b36f452f13f897eC1CCBe660A64971B6095f666',
    AAVE_PRIZE_POOL_BUILDER: '0x267DEC85e719d56B79080D3b27929B3cAB6af581',
    cDai: '0x7b36f452f13f897eC1CCBe660A64971B6095f666',
    cUsdc: '0x7b36f452f13f897eC1CCBe660A64971B6095f666',
    cUsdt: '0x7b36f452f13f897eC1CCBe660A64971B6095f666',
    cBat: '0x7b36f452f13f897eC1CCBe660A64971B6095f666',
    cWbtc: '0x7b36f452f13f897eC1CCBe660A64971B6095f666',
    cZrx: '0x7b36f452f13f897eC1CCBe660A64971B6095f666',
    COMPOUND_PRIZE_POOL_BUILDER: '0xA3A1cB15DE725d621134998a610A491e87586D43',
    SINGLE_RANDOM_WINNER_BUILDER: '0x7b968cc6D6Fd4ee93E19780E8Ee68B5ca62A2195',
    TWO_WINNERS_BUILDER: '0xb38e46EBf90888D621Cde5661D3cC2476d7bCc2e',
    RNG_SERVICE: {
      blockhash: '0x8739Da6c93D0CE6F5de9D2d71493fAF012F2bDbD',
      chainlink: '0x2aeB429f7d8c00983E033087Dd5a363AbA2AC55f'
    }
  }
}
