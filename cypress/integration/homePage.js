describe('Load Home Page', () => {
  it('successfully loads', () => {
    cy.visit('/')

    cy.contains('Connect Wallet').click()
    cy.contains('Show More').click()
    cy.contains('Web3 Wallet').click()
    cy.contains('Select the type of prize pool').click()
    cy.contains('Yield Prize Pool (Compound Protocol)').click()
    cy.contains('Select a token to be deposited').click()
    cy.contains('USDC').click()
    cy.contains('Select a random number generator service').click()
    cy.contains('Blockhash').click()
    cy.contains('Create New Prize Pool').click()

    cy.contains('Contracts deployed!', { timeout: 10000 })
  })
})
