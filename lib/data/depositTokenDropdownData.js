const compoundOptions = {
  1: [
    { value: '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643', label: 'cDai', color: '#00B8D9' },
    { value: '0x39AA39c021dfbaE8faC545936693aC917d5E7563', label: 'cUsdc', color: '#00B8D9' },
    { value: '0xf650C3d88D12dB855b8bf7D11Be6C55A4e07dCC9', label: 'cUsdt', color: '#00B8D9' },
    { value: '0x6C8c6b02E7b2BE14d4fA6022Dfd6d75921D90E4E', label: 'cBat', color: '#00B8D9' },
    { value: '0x70e36f6bf80a52b3b46b3af8e106cc0ed743e8e4', label: 'cComp', color: '#00B8D9' },
    { value: '0xC11b1268C1A384e55C48c2391d8d480264A3A7F4', label: 'cWbtc', color: '#00B8D9' },
    { value: '0x35a18000230da775cac24873d00ff85bccded550', label: 'cUni', color: '#00B8D9' },
    { value: '0xB3319f5D18Bc0D84dD1b4825Dcde5d5f7266d407', label: 'cZrx', color: '#00B8D9' }
  ],
  4: [
    { value: '0x6D7F0754FFeb405d23C51CE938289d4835bE3b14', label: 'cDai', color: '#00B8D9' },
    { value: '0x5B281A6DdA0B271e91ae35DE655Ad301C976edb1', label: 'cUsdc', color: '#00B8D9' },
    { value: '0x2fB298BDbeF468638AD6653FF8376575ea41e768', label: 'cUsdt', color: '#00B8D9' },
    { value: '0xEBf1A11532b93a529b5bC942B4bAA98647913002', label: 'cBat', color: '#00B8D9' },
    { value: '0x0014F450B8Ae7708593F4A46F8fa6E5D50620F96', label: 'cWbtc', color: '#00B8D9' },
    { value: '0x52201ff1720134bBbBB2f6BC97Bf3715490EC19B', label: 'cZrx', color: '#00B8D9' }
  ],
  42: [
    { value: '0x4a77faee9650b09849ff459ea1476eab01606c7a', label: 'cBat', color: '#f50' },
    { value: '0xf0d0eb522cfa50b716b3b1604c4f0fa6f04376ad', label: 'cDai', color: '#f50' },
    { value: '0xa4ec170599a1cf87240a35b9b1b8ff823f448b57', label: 'cRep', color: '#f50' },
    { value: '0xb3f7fb482492f4220833de6d6bfcc81157214bec', label: 'cSai', color: '#f50' },
    { value: '0x4a92e71227d294f041bd82dd8f78591b75140d63', label: 'cUsdc', color: '#f50' },
    { value: '0x3f0a0ea2f86bae6362cf9799b523ba06647da018', label: 'cUsdt', color: '#f50' },
    { value: '0xa1faa15655b0e7b6b6470ed3d096390e6ad93abb', label: 'cWbtc', color: '#f50' },
    { value: '0xaf45ae737514c8427d373d50cd979a242ec59e5a', label: 'cZrx', color: '#f50' }
  ]
}

const rariFuseOptions = {
  1: [
    {
      value: '0xd8553552f8868C1Ef160eEdf031cF0BCf9686945',
      label: 'fFei8',
      color: '#00B8D9'
    },
    {
      value: '0xFd3300A9a74b3250F1b2AbC12B47611171910b07',
      label: 'fTribe8',
      color: '#00B8D9'
    }
  ]
}

export const groupedOptions = {
  1: [
    {
      label: 'Compound Finance',
      options: compoundOptions[1]
    },
    {
      label: 'Rari Fuse',
      options: rariFuseOptions[1]
    }
  ],
  4: [
    {
      label: 'Compound Finance',
      options: compoundOptions
    }
  ]
}
