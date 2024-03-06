describe('simplae vacancy full create', () => {

  it('pass create', () => {
    //1 page
    cy.setCookie('accessToken','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDAyLCJlbWFpbCI6InJhYnVzdGVzQGdtYWlsLmNvbSIsInBob25lIjoiKzc5MjY5NjI3MjAxIiwiaWF0IjoxNzA5NzE3MzgwLCJleHAiOjE3NDEyODAzODB9.xLsKr-XKq1KBzahQacyCUXbJk0e__KCEEFEJ_QlCeco')
    cy.setCookie('profile-type','hirer')
    cy.visit('http://arbi.local.glob-com.ru:3088/create/vacancy')
    cy.get('.VacancyName_inputWrapper__r2X38 > .InputField_root__Vhrw0 > .InputField_wrapper__qWvo4 > .InputField_input___XmbY')  
    .should('be.visible')
    .focus()
    .type('Менеджер', {delay: 50})
    cy.get('.VacancyName_suggestionsWrapper__nAPbq > :nth-child(1)').click()
    cy.get('.Vacancy_buttonWrapper__Imhuc > .Button_root__YFQZ_ > .Button_text__OBzVg').wait(50).click()
    //2 page
    

  })



})