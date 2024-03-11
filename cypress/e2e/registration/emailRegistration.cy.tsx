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

  const completeRegistration = (phone: string, email: string) => {
    cy.get('#phone-field input').type(phone)
    cy.get('@nextButton').click()
    cy.get('[data-cy="input_firstName"]').type('testCyName')
    cy.get('[data-cy="input_lastName"]').type('testCyLastName')
    cy.get('[data-cy="input_patronymic"]').type('testCyPartonyimic')
    cy.get('[data-cy="button_register"]').click()
    cy.contains('Создать резюме')
    cy.visit('http://arbi.local.glob-com.ru:3088/settings')
    cy.get('[data-cy="input_email"] input').should('have.value', email)
    cy.get('#phone-field input').should('include.value', '+7 800')
    cy.get('[data-cy="input_firstName"] input').should('have.value','testCyName')
    cy.get('[data-cy="input_lastName"] input').should('have.value','testCyLastName')
    cy.get('[data-cy="input_patronymic"] input').should('have.value','testCyPartonyimic')
  }

  const enterPass = () => {
    cy.get('[data-cy="confirmCode"]').invoke('attr', 'data-value')
    .then(v => {
      const vArr = v.split('')
      cy.get('.pincode-input-container > :nth-child(1)').type(vArr[0])
      cy.get('.pincode-input-container > :nth-child(2)').type(vArr[1])
      cy.get('.pincode-input-container > :nth-child(3)').type(vArr[2])
      cy.get('.pincode-input-container > :nth-child(4)').type(vArr[3])
    })
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
    cy.wait(500)
    enterPass()
    cy.wait(1000)
    cy.get('#phone-field input').type('9269627201')
    cy.get('@nextButton').click()
    cy.contains('Такой телефон уже есть в системе')
  })

  it('should register new user via email and data saving', ()=> {
    const email = `test${new Date().getTime()}@test.com`
    const phone = `800${String(new Date().getTime()).split('').slice(0, 7).join('')}`
    typeEmail(email)
    typePassword('testPassword')
    cy.get('@nextButton').click()
    cy.wait(500)
    enterPass()
    cy.wait(1000)
    completeRegistration(phone, email)
  })

  it('should register user after incomplete registration', ()=> {
    const email = `test${new Date().getTime()}@test.com`
    const phone = `800${String(new Date().getTime()).split('').slice(0, 7).join('')}`
    typeEmail(email)
    typePassword('testPassword')
    cy.get('@nextButton').click()
    cy.wait(500)
    enterPass()
    cy.wait(1000)
    cy.clearCookie('access-token')
    cy.clearCookie('profile-type')
    cy.reload()
    visit()
    typeEmail(email)
    typePassword('testPassword')
    cy.get('@nextButton').click()
    cy.wait(500)
    enterPass()
    cy.wait(1000)
    completeRegistration(phone, email)
  })
})