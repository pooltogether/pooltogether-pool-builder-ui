describe('Smoke Test', () => {
  it('successfully loads & deploys a USDC pool', () => {
    cy.visit('/')

    cy.get('#_connectWallet').click()
    cy.contains('Web3 Wallet').click()
    cy.get('#menu-button--prize-pool-dropdown').click()
    cy.get('#option-2--prize-pool-dropdown').click()
    cy.get('#menu-button--token-dropdown').click()
    cy.get('#option-1--token-dropdown').click()
    cy.get('#menu-button--rng-dropdown').click()
    cy.get('#option-0--rng-dropdown').click()
    cy.get('#_createNewPrizePool').click()

    cy.contains('Contracts deployed!', { timeout: 20000 })
  })
})
