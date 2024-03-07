describe('email registration', () => {

  const visit = ()=>{
    cy.visit('http://arbi.local.glob-com.ru:3088/registration')
    cy.contains('Почта').click()
  }

  const typeEmail = (email: string) => {
    cy.get('[data-cy="input_email"] input')
    .type(email)
    .should('have.value', email)
  }

  const typePassword = (password: string) => {
    cy.get('[data-cy="input_password"] input')
    .type(password)
    .should('have.value', password)
  }

  beforeEach(()=> {
    visit()
    cy.get('[data-cy="button_next"]').as('nextButton')
  })

  it('registration page shows correctly', visit)

  it('if email exist in system - show error', () => {
    typeEmail('bull1604@yandex.ru')
    typePassword('testPassword')    
    cy.get('@nextButton').click()
    cy.contains('Такой email уже есть в системе')
  })

  it('if email not exists but number do', ()=> {
    typeEmail(`test${new Date().getTime()}@test.com`)
    typePassword('testPassword')
    cy.get('@nextButton').click()
    cy.get('[data-cy="confirmCode"]')
    // cy.get('[data-cy="confirmCode"]').then(v => {

    //   const code = v.html().split('')
    //   cy.get('.pincode-input-container > :nth-child(1)').type(code[0])
    // })
  })


})