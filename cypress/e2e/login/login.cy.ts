describe('login', () => {
  it('passes', () => {
    cy.visit('http://arbi.local.glob-com.ru:3088/login')
    cy.get('.PhoneInputInput').type('9269627201')
    cy.get('.InputField_wrapper__qWvo4').type('testPassword')
    cy.get('.login_form__0wMbt > .Button_root__YFQZ_').click()
    cy.url().should('eq', 'http://arbi.local.glob-com.ru:3088/')
    cy.get('.Button_gradient__KVrrv > .Button_text__OBzVg').should('be.visible')
  })
})

