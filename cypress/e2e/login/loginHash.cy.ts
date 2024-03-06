describe('login wuth hash', () => {
  it('passes', () => {
    cy.setCookie('accessToken','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDAyLCJlbWFpbCI6InJhYnVzdGVzQGdtYWlsLmNvbSIsInBob25lIjoiKzc5MjY5NjI3MjAxIiwiaWF0IjoxNzA5NzE3MzgwLCJleHAiOjE3NDEyODAzODB9.xLsKr-XKq1KBzahQacyCUXbJk0e__KCEEFEJ_QlCeco')
    cy.setCookie('profile-type','hirer')
    cy.visit('http://arbi.local.glob-com.ru:3088/')
    cy.get('.Button_gradient__KVrrv > .Button_text__OBzVg').should('be.visible')
  })
})