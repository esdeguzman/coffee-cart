describe('coffee cart testing', () => {
  it('can verify that upon initial access to the shop, confirm that the cart displays zero coffee items, the total amount is $0.00, and the checkout button is disabled.', () => {
    cy.visit('http://localhost:5173')
    cy.origin('http://localhost:4170', () => {
      cy.get('input[name=username]').type('user')
      cy.get('input[name=password]').type('pw')
      cy.get('button[type=submit]').click()
    })
    cy.contains('cart (0)').should('be.visible')
    cy.get('div.pay-container').as('payContainer').should('exist')
    cy.get('@payContainer').find('button').should('have.text', 'Total: $0.00')
    cy.get('@payContainer').find('button').should('have.be', 'disabled')
    cy.screenshot({capture: 'viewport'})
  })
})