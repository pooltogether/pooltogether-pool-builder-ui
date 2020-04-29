export default [
    {
      "inputs": [
        {
          "internalType": "contract CTokenInterface",
          "name": "cToken",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "prizePeriodInSeconds",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_collateralName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_collateralSymbol",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_ticketName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_ticketSymbol",
          "type": "string"
        }
      ],
      "name": "createSingleRandomWinnerPrizePool",
      "outputs": [
        {
          "internalType": "contract SingleRandomWinnerPrizeStrategy",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "contract PrizePoolBuilder",
          "name": "_prizePoolBuilder",
          "type": "address"
        },
        {
          "internalType": "contract SingleRandomWinnerPrizeStrategyFactory",
          "name": "_prizeStrategyFactory",
          "type": "address"
        }
      ],
      "name": "initialize",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "prizePoolBuilder",
      "outputs": [
        {
          "internalType": "contract PrizePoolBuilder",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "prizeStrategyFactory",
      "outputs": [
        {
          "internalType": "contract SingleRandomWinnerPrizeStrategyFactory",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
