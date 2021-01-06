#!/bin/sh

yarn dev & npx hardhat node --fork https://eth-mainnet.alchemyapi.io/v2/$ALCHEMY_ENV_VAR & npx wait-on http://localhost:3000 & npx wait-on http://localhost:8545 & npx cypress run