#!/bin/sh

yarn dev & npx hardhat node --fork https://eth-mainnet.alchemyapi.io/v2/$ALCHEMY_API_KEY & npx wait-on http://localhost:3000 & npx wait-on http://localhost:8545 & npx cypress run --record --key $CYPRESS_RECORD_KEY