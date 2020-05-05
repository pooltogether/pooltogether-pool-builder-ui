export default [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "prizePool",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "interestPool",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "ticket",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "distributionStrategy",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "prizePeriodSeconds",
        "type": "uint256"
      }
    ],
    "name": "PrizePoolCreated",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "compoundInterestPoolBuilder",
    "outputs": [
      {
        "internalType": "contract CompoundInterestPoolBuilder",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "controlledTokenFactory",
    "outputs": [
      {
        "internalType": "contract ControlledTokenFactory",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract CTokenInterface",
        "name": "cToken",
        "type": "address"
      },
      {
        "internalType": "contract PrizeStrategyInterface",
        "name": "_prizeStrategy",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "prizePeriodSeconds",
        "type": "uint256"
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
      },
      {
        "internalType": "string",
        "name": "_sponsorshipName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_sponsorshipSymbol",
        "type": "string"
      }
    ],
    "name": "createPeriodicPrizePool",
    "outputs": [
      {
        "internalType": "contract PrizePool",
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
        "internalType": "contract CompoundInterestPoolBuilder",
        "name": "_compoundInterestPoolBuilder",
        "type": "address"
      },
      {
        "internalType": "contract PeriodicPrizePoolFactory",
        "name": "_periodicPrizePoolFactory",
        "type": "address"
      },
      {
        "internalType": "contract TicketFactory",
        "name": "_ticketFactory",
        "type": "address"
      },
      {
        "internalType": "contract ControlledTokenFactory",
        "name": "_controlledTokenFactory",
        "type": "address"
      },
      {
        "internalType": "contract RNGInterface",
        "name": "_rng",
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
    "name": "periodicPrizePoolFactory",
    "outputs": [
      {
        "internalType": "contract PeriodicPrizePoolFactory",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "rng",
    "outputs": [
      {
        "internalType": "contract RNGInterface",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "ticketFactory",
    "outputs": [
      {
        "internalType": "contract TicketFactory",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]