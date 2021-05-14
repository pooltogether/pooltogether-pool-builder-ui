import { axiosInstance } from '../lib/axiosInstance'

exports.handler = async (event, context, callback) => {
  const { address } = event.queryStringParameters

  const url = `https://api.coingecko.com/api/v3/coins/ethereum/contract/${address}`

  try {
    const response = await axiosInstance.get(url)

    if (response && response.status === 404) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(null)
      }
    } else if (response && response.status < 400) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(response.data)
      }
    } else {
      return {
        statusCode: response.status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: response.data })
      }
    }
  } catch (e) {
    return {
      statusCode: 500,
      body: e.message
    }
  }
}
