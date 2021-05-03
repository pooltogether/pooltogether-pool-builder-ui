const compoundOptions = {
  1: [
    {
      value: '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643',
      label: 'Compound Dai',
      image: '/tokens/dai-new-transparent.png'
    },
    {
      value: '0x39AA39c021dfbaE8faC545936693aC917d5E7563',
      label: 'Compound USDC',
      image: '/tokens/usdc-new-transparent.png'
    },
    {
      value: '0xf650C3d88D12dB855b8bf7D11Be6C55A4e07dCC9',
      label: 'Compound USDT',
      image: '/tokens/usdt-new-transparent.png'
    },
    {
      value: '0x6C8c6b02E7b2BE14d4fA6022Dfd6d75921D90E4E',
      label: 'Compound BAT',
      image: '/tokens/bat-new-transparent.png'
    },
    {
      value: '0x70e36f6bf80a52b3b46b3af8e106cc0ed743e8e4',
      label: 'Compound Comp',
      image: '/tokens/comp.svg'
    },
    {
      value: '0xC11b1268C1A384e55C48c2391d8d480264A3A7F4',
      label: 'Compound Wrapped Bitcoin',
      image: '/tokens/wbtc-new-transparent.png'
    },
    {
      value: '0x35a18000230da775cac24873d00ff85bccded550',
      label: 'Compound UNI',
      image: '/tokens/uni.png'
    },
    {
      value: '0xB3319f5D18Bc0D84dD1b4825Dcde5d5f7266d407',
      label: 'Compound ZRX',
      image: '/tokens/zrx-new-transparent.png'
    }
  ],
  4: [
    {
      value: '0x6D7F0754FFeb405d23C51CE938289d4835bE3b14',
      label: 'Compound Dai',
      image: '/tokens/dai-new-transparent.png'
    },
    {
      value: '0x5B281A6DdA0B271e91ae35DE655Ad301C976edb1',
      label: 'Compound USDC',
      image: '/tokens/usdc-new-transparent.png'
    },
    {
      value: '0x2fB298BDbeF468638AD6653FF8376575ea41e768',
      label: 'Compound USDT',
      image: '/tokens/usdt-new-transparent.png'
    },
    {
      value: '0xEBf1A11532b93a529b5bC942B4bAA98647913002',
      label: 'Compound BAT',
      image: '/tokens/bat-new-transparent.png'
    },
    {
      value: '0x0014F450B8Ae7708593F4A46F8fa6E5D50620F96',
      label: 'Compound Wrapped Bitcoin',
      image: '/tokens/wbtc-new-transparent.png'
    },
    {
      value: '0x52201ff1720134bBbBB2f6BC97Bf3715490EC19B',
      label: 'Compound ZRX',
      image: '/tokens/zrx-new-transparent.png'
    }
  ],
  42: [
    {
      value: '0x4a77faee9650b09849ff459ea1476eab01606c7a',
      label: 'Compound BAT',
      image: '/tokens/bat-new-transparent.png'
    },
    {
      value: '0xf0d0eb522cfa50b716b3b1604c4f0fa6f04376ad',
      label: 'Compound Dai',
      image: '/tokens/dai-new-transparent.png'
    },
    {
      value: '0x4a92e71227d294f041bd82dd8f78591b75140d63',
      label: 'Compound USDC',
      image: '/tokens/usdc-new-transparent.png'
    },
    {
      value: '0x3f0a0ea2f86bae6362cf9799b523ba06647da018',
      label: 'Compound USDT',
      image: '/tokens/usdt-new-transparent.png'
    },
    {
      value: '0xa1faa15655b0e7b6b6470ed3d096390e6ad93abb',
      label: 'Compound Wrapped Bitcoin',
      image: '/tokens/wbtc-new-transparent.png'
    },
    {
      value: '0xaf45ae737514c8427d373d50cd979a242ec59e5a',
      label: 'Compound ZRX',
      image: '/tokens/zrx-new-transparent.png'
    }
  ]
}

const rariFuseOptions = {
  1: [
    {
      value: '0xd8553552f8868C1Ef160eEdf031cF0BCf9686945',
      label: 'Fuse $FEI (Pool 8)',
      color: '#00B8D9'
    },
    {
      value: '0xFd3300A9a74b3250F1b2AbC12B47611171910b07',
      label: 'Fuse $TRIBE (Pool 8)',
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
      options: compoundOptions[4]
    }
  ],
  42: [
    {
      label: 'Compound Finance',
      options: compoundOptions[42]
    }
  ]
}
