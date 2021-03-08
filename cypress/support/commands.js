// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// FROM SYBIL

import Web3 from 'web3'
import PrivateKeyProvider from 'truffle-privatekey-provider'

// // never send real ether to this, obviously
const PRIVATE_KEY_TEST_NEVER_USE =
  '0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e'

// sets up the injected provider to be a mock ethereum provider with the given mnemonic/index
Cypress.Commands.overwrite('visit', (original, url, options) => {
  return original(
    url.startsWith('/') && url.length > 2 && !url.startsWith('/#') ? `/#${url}` : url,
    {
      ...options,
      onBeforeLoad(win) {
        options && options.onBeforeLoad && options.onBeforeLoad(win)
        win.localStorage.clear()
        const p = new PrivateKeyProvider(PRIVATE_KEY_TEST_NEVER_USE, 'http://127.0.0.1:8545/')
        win.web3 = new Web3(p)
      }
    }
  )
})
