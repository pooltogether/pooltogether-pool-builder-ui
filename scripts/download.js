const request = require('request')
const fs = require('fs')
const axios = require('axios')

const BASE_COINGECKO_URI = `https://api.coingecko.com/api/v3/coins/ethereum/contract`
const TOKEN_ADDRESSES = {
  dai: '0x6b175474e89094c44da98b954eedeac495271d0f',
  usdc: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
}

function getUrlExtension( url ) {
  return url.split(/[#?]/)[0].split('.').pop().trim()
}

async function download (url, dest) {
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
      .on('error', error => {
        reject(error)
      })
  }).catch(error => {
    console.log(`Something happened: ${error}`)
  })
}

;(async () => {
  const promises = []
  Object.keys(TOKEN_ADDRESSES).forEach(key => {
    const address = TOKEN_ADDRESSES[key]
    promises.push(axios.get(`${BASE_COINGECKO_URI}/${address}`))
  })

  const responses = await Promise.all(promises)

  const tokenImageUrls = []
  responses.forEach(response => {
    tokenImageUrls.push({
      symbol: response.data.symbol,
      ...response.data.image,
    })
  })
  // console.log(tokenImageUrls)

  
  const imageDownloadPromises = []
  tokenImageUrls.forEach(tokenImageUrl => {
    // console.log(tokenImageUrl)
    const { symbol } = tokenImageUrl
    // console.log(symbol)
    const sizes = ['thumb', 'small', 'large']

    sizes.forEach(size => {
      console.log(tokenImageUrl)
      console.log('hello')
      console.log(size)
      const url = tokenImageUrl[size]
      const extension = getUrlExtension(url)
      console.log(url)
      console.log({extension})
      const newFilename = `./${symbol}-${size}.${extension}`
      console.log(newFilename)
      imageDownloadPromises.push(
        download(url, newFilename)
      )
    })
    console.log('got here')
  })

  console.log(imageDownloadPromises)
  const downloadResponses = await Promise.all(imageDownloadPromises)
  console.log(downloadResponses)

  console.log('done ...')
})()
