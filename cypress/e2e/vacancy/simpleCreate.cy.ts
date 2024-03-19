describe('simple vacancy full create', () => {

  it('pass create and check preview', () => {
    //1 page
    cy.setCookie('accessToken','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDAyLCJlbWFpbCI6InJhYnVzdGVzQGdtYWlsLmNvbSIsInBob25lIjoiKzc5MjY5NjI3MjAxIiwiaWF0IjoxNzA5NzE3MzgwLCJleHAiOjE3NDEyODAzODB9.xLsKr-XKq1KBzahQacyCUXbJk0e__KCEEFEJ_QlCeco')
    cy.setCookie('profile-type','hirer')
    cy.visit('http://arbi.local.glob-com.ru:3088/create/vacancy')
    const nextButton = cy.get('[data-cy="button_next"]', {timeout: 5000})
    cy.get('[data-cy="input_name"] input')  
    .should('be.visible')
    .focus()
    .type('Менеджер-cy-test', {delay: 50})
    cy.get('.VacancyName_suggestionsWrapper__nAPbq > :nth-child(1)').click()
    nextButton.wait(50).click()
    //2 page
    cy.get('[data-field="salaryMin"] > .InputField_wrapper__qWvo4 > .InputField_input___XmbY')
    .type('10000').should('contain.value', '10 000')
    cy.get('[data-field="salaryMax"] > .InputField_wrapper__qWvo4 > .InputField_input___XmbY')
    .type('20000').should('contain.value', '20 000')
    nextButton.wait(50).click()
    //3 page
    nextButton.wait(50).click()
    //4Page
    cy.get('.AddButton_link__QWiUd').wait(1000).click()
    cy.get('.Sourses_wrapper__LbIlI > :nth-child(1)', {timeout: 5000}).click()
    cy.get('.Body_buttonGradient__nLlV3 > .Button_text__OBzVg').click()
    nextButton.wait(50).click()
    //5 page
    cy.get('.Vacancy_form__s3sjc > :nth-child(1) > :nth-child(1)').wait(200).click()
    cy.get('.CvModals_categories___6jwc > :nth-child(1)').click()
    cy.get('.Body_buttonGradient__nLlV3 > .Button_text__OBzVg').click()
    cy.get('.Vacancy_form__s3sjc > :nth-child(1) > :nth-child(3)').wait(200).click()
    cy.get(':nth-child(1) > .Languages_list__VGpi4 > :nth-child(1)').click()
    cy.get(':nth-child(2) > .Languages_title__7vjsi').click()
    cy.get(':nth-child(2) > .Languages_list__VGpi4 > :nth-child(1)').wait(100).click()
    cy.get('.Body_buttonGradient__nLlV3 > .Button_text__OBzVg').wait(100).click()
    nextButton.wait(50).click()
    //6 page
    nextButton.wait(50).click()
    //7page
    cy.get('[data-cy="checkbox_showContactName"').click()
    cy.get('[data-cy="checkbox_showEmail"').click()
    cy.get('[data-cy="checkbox_showTelegramNickname"').click()
    cy.get('[data-cy="checkbox_showPhone"').click()
    nextButton.wait(50).click()
    //8page
    cy.get('[data-cy="button_preview"]').click()
    //  Preview
    cy.url().should('contain', 'http://arbi.local.glob-com.ru:3088/preview/vacancy')
    cy.get('[data-cy="button_back"]').wait(100).click()
    //Save Vacancy
    cy.url().should('contain', 'http://arbi.local.glob-com.ru:3088/create/vacancy')
    cy.get('[data-cy="button_saveVacancy1"]').click()
    cy.contains('Менеджер-cy-test', {timeout: 10000}).should('be.visible')
  })
})