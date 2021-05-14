const request = require('request')
const fs = require('fs')
const axios = require('axios')

const BASE_COINGECKO_URI = `https://api.coingecko.com/api/v3/coins/ethereum/contract`
const TOKEN_ADDRESSES = {
  'badger': '0x3472a5a71965499acd81997a54bba8d852c6e53d',
  // 'cover': '0xe4d247b7cebd5e3957ee41a247074457a1e7402d',
  // 'sushi': '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
  'alcx': '0xdbdb4d16eda451d0503b854cf79d55697f90c8df',
  // 'rgt': '0xD291E7a03283640FDc51b121aC401383A46cC623',
  'fei': '0x956F47F50A910163D8BF957Cf5846D573E7f87CA',
  'tribe': '0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B',
  'rai': '0x03ab458634910aad20ef5f1c8ee96f1d6ac54919',
  'busd': '0x4Fabb145d64652a948d72533023f6E7A623C7C53',
  'gusd': '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd',
  // 'susd': '0x57ab1e02fee23774580c119740129eac7081e9d3',
  'aave': '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
  'enj': '0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c',
  'knc': '0xdd974d5c2e2928dea5f71b9825b8b646686bd200',
  'link': '0x514910771af9ca656af840dff83e8264ecf986ca',
  'mana': '0x0f5d2fb29fb7d3cfee444a200298f468908cc942',
  'mkr': '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
  'matic': '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
  'weth': '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  'ftm': '0x4e15361fd6b4bb609fa63c81a2be19d873717870',
  'ust': '0xa47c8bf37f92abed4a126bda807a7b7498661acd',
  'frax': '0x853d955acef822db058eb8505911ed77f175b99e',
  'ogn': '0x8207c1ffc5b6804f6024322ccf34f29c3541ae26',
  '1inch': '0x111111111117dc0aa78b770fa6a738034120c302',
  'hegic': '0x584bc13c7d411c00c01a62e8019472de68768430',
  'husd': '0xdf574c24545e5ffecb9a659c229253d4111d87e1',
  'kp3r': '0x1ceb5cb57c4d4e2b2433641b95dd330a33185a44',
  'bond': '0x0391D2021f89DC339F60Fff84546EA23E337750f',
  'wnxm': '0x0d438f3b5175bebc262bf23753c1e53d03432bde',
  'ftt': '0x50d1c9771902476076ecfc8b2a83ad6b9355a4c9',
  'yusd': '0x5dbcf33d8c2e976c6b560249878e6f1491bca25c',
  'mta': '0xa3BeD4E1c75D00fa6f4E5E6922DB7261B5E9AcD2',
  // 'renbtc': '0xeb4c2781e4eba804ce9a9803c67d0893436bb27d',
  'crv': '0xD533a949740bb3306d119CC777fa900bA034cd52',
  'ycrv': '0xD533a949740bb3306d119CC777fa900bA034cd52',
  'yfi': '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e',
  'bal': '0xba100000625a3754423978a60c9317c58a424e3d'
}

function getUrlExtension(url) {
  return url.split(/[#?]/)[0].split('.').pop().trim()
}

async function download(url, dest) {
  /* Create an empty file where we can save data */
  const file = fs.createWriteStream(dest)

  /* Using Promises so that we can use the ASYNC AWAIT syntax */
  await new Promise((resolve, reject) => {
    request({
      /* Here you should specify the exact link to the file you are trying to download */
      uri: url,
      gzip: true
    })
      .pipe(file)
      .on('finish', async () => {
        console.log(`The file is finished downloading.`)
        resolve()
      })
      .on('error', (error) => {
        reject(error)
      })
  }).catch((error) => {
    console.log(`Something happened: ${error}`)
  })
}

;(async () => {
  const promises = []
  Object.keys(TOKEN_ADDRESSES).forEach((key) => {
    const address = TOKEN_ADDRESSES[key]
    promises.push(axios.get(`${BASE_COINGECKO_URI}/${address}`))
  })

  let responses
  try {
    responses = await Promise.all(promises)
  } catch (e) {
    console.error(e)
  }

  const tokenImageUrls = []
  responses.forEach((response) => {
    tokenImageUrls.push({
      symbol: response.data.symbol,
      ...response.data.image
    })
  })

  const imageDownloadPromises = []
  tokenImageUrls.forEach((tokenImageUrl) => {
    const { symbol } = tokenImageUrl
    const sizes = ['thumb', 'small', 'large']

    sizes.forEach((size) => {
      const url = tokenImageUrl[size]
      const extension = getUrlExtension(url)
      const newFilename = `../public/tokens/${symbol}-${size}.${extension}`
      imageDownloadPromises.push(download(url, newFilename))
    })
  })

  const downloadResponses = await Promise.all(imageDownloadPromises)

  console.log('done ...')
})()
