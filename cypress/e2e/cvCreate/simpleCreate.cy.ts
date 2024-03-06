const token1 ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUxLCJlbWFpbCI6IjEyMzQyMzQyMzQyQGFtZXJpY2EuYXUiLCJwaG9uZSI6IisxMjM0MjM0MjM0MiIsImlhdCI6MTcwOTczOTUyNCwiZXhwIjoxNzQxMzAyNTI0fQ.cowmrdd42io67Sc4RhS_gAxfbEhPqt3_vh_PGmtP9a8'
const token2 ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDAwLCJlbWFpbCI6ImJ1bGwxNjA0QGdtYWlsLmNvbSIsInBob25lIjoiKzc5MjY5NjI3MjAyIiwiaWF0IjoxNzA5NzI1OTk3LCJleHAiOjE3NDEyODg5OTd9.0_P4pq8VD6b9Ov2KEdfA8euPtLnOIcNlCIoJp2D2Irs'

describe('simple cv full create', ()=> {
  it('pass create and check preview', ()=> {
    cy.setCookie('accessToken', token1)
    cy.setCookie('profile-type', 'employee')
    cy.visit('http://arbi.local.glob-com.ru:3088/create/cv')
    const nextButton = cy.get('[data-cy="button_next"]', {timeout: 5000})
    cy.wait(1000)
    //1page
    cy.get('[data-cy="input_searchPosition"] input')
    .should('be.visible')
    .focus()
    .type('Про', {delay: 50})
    cy.get('[data-cy="suggestions_wrapper"] > :nth-child(1)')
    .contains('Продуктовый аналитик')
    .should('be.visible')
    .click()
    const saveSalary = cy.get('[data-cy="button_saveAndNext"]')
    saveSalary.should('be.visible').click()
    cy.contains('Обязательное поле', {timeout: 3000})
    cy.get('[data-cy="input_salary"] input').type('10000', {delay: 50}).should('have.value', '10 000')
    saveSalary.click()
    
    //2 page
    //--birthday
    const birthday = cy.get('[data-cy="input_birthday"] input')
    birthday.then((_inpt) => {
      if(_inpt.val() === '') {
        nextButton.click()
        cy.contains('Укажите дату рождения', {timeout: 3000})
        cy.get('[data-cy="input_birthday"] input').type('01.01.2000', {delay: 50})
      }
    })
    cy.wait(1000)
    //-- whatsapp
    cy.get('[data-cy="input_whatsapp"] input')
    .should('be.visible')
    .type('whatsAppTest')
    .should('have.value', 'whatsAppTest')
    //-- linkedin
    cy.get('[data-cy="input_linkedin"] input')
    .should('be.visible')
    .type('linkedinTest')
    .should('have.value', 'linkedinTest')
    //--viber
    cy.get('[data-cy="input_viber"] input')
    .should('be.visible')
    .type('viberTest')
    .should('have.value', 'viberTest')
    //--skype
    cy.get('[data-cy="input_skype"] input')
    .should('be.visible')
    .type('skypeTest')
    .should('have.value', 'skypeTest')
    //--bio
    cy.get('[data-cy="textarea_bio"] textarea')
    .focus()
    .should('be.visible')
    .type('testBioAbout')
    .should('have.value', 'testBioAbout')
    nextButton.click()
    
    //3page
    //--experiencePresent
    cy.get('[data-cy="addWorkPlace"]').should('not.exist')
    cy.get('[data-cy="radio_present"]')
    .should('be.visible')
    .click()
    cy.get('[data-cy="addWorkPlace"]').should('be.visible').click()
    //--fill experience info
    cy.get('[data-cy="input_experienceInfo[0].fromDate"] input', {timeout: 1000})
    .should('be.visible')
    .type('01.01.2023')
    .should('have.value', '01.01.2023')
    cy.get('[data-cy="input_experienceInfo[0].company"] input')
    .type('testCompany')
    .should('have.value', 'testCompany')
    cy.get('[data-cy="input_experienceInfo[0].position"] input')
    .type('testPosition')
    .should('have.value', 'testPosition')
    cy.get('[data-cy="textarea_experienceInfo[0].description"] textarea')
    .type('testGoals')
    .should('have.value', 'testGoals')
    cy.get('[data-cy="button_addButton"]').click()
    nextButton.click()

    //4page
    cy.get('[data-cy="addEducation"]').should('not.exist')
    cy.get('[data-cy="radio_doctor"]')
    .click()
    cy.get('[data-cy="addEducation"]').should('be.visible')
    .click()
    //--fill educationInfo
    cy.get('[data-cy="input_educationInfo[0].fromDate"] input')
    .should('be.visible')
    .click()
    cy.get('.react-datepicker__year-wrapper > :nth-child(1)')
    .should('be.visible').click()
    cy.get('[data-cy="input_educationInfo[0].institution"] input')
    .type('testInstitution')
    .should('have.value', 'testInstitution')
    cy.get('[data-cy="input_educationInfo[0].faculity"] input')
    .type('testFaculity')
    .should('have.value', 'testFaculity')
    cy.get('[data-cy="input_educationInfo[0].speciality"] input')
    .type('testSpeciality')
    .should('have.value', 'testSpeciality')
    cy.get('[data-cy="button_addButton"]').click()
    nextButton.click()

    //5page
    //--add skill
    cy.get('[data-cy="addSkill"]')
    .should('be.visible')
    .click()
    cy.get('[data-cy="modal_search"]')
    .type('Про', {delay: 50})
    cy.get('.CvModals_categories___6jwc > :nth-child(1)')
    .contains('Программа').click()
    cy.get('[data-cy="button_saveSkill"]')
    .click()
    //--add verticals
    cy.get('[data-cy="addVerticals"]').click()
    cy.get('[data-cy="sources_wrapper"] > :nth-child(1)').click()
    cy.get('[data-cy="button_saveSkill"]').click()
    //--add language
    cy.get('[data-cy="addLanguage"]').click()
    cy.get('[data-cy="radio_en"]').click()
    cy.get(':nth-child(2) > .Languages_title__7vjsi').click()
    cy.get('[data-cy="radio_elementary"]').click()
    cy.get('[data-cy="button_saveSkill"]').click()
    //--add portfolio
    cy.get('[data-cy="addPortfolio"]').click()
    cy.get('[data-cy="input_portfolio"] input')
    .focus()
    .type('youtube.com')
    .blur()
    cy.contains('Неверный формат ссылки')
    cy.get('[data-cy="input_portfolio"] input')
    .focus()
    .clear()
    .blur()
    .wait(500)
    cy.get('[data-cy="input_portfolio"] input')
    .type('https://www.youtube.com')
    cy.contains('Неверный формат ссылки').should('not.exist')
    cy.get('[data-cy="button_save"]')
    .click()
    nextButton.click()

    //6stage
    nextButton.click()
    

    //7stage
    cy.get('[data-cy="button_preview"]').click()
    //  Preview
    cy.url().should('contain', 'http://arbi.local.glob-com.ru:3088/preview/cv')
    cy.get('[data-cy="button_back"]').wait(100).click()
    //Save Vacancy
    cy.url().should('contain', 'http://arbi.local.glob-com.ru:3088/create/cv')
    cy.get('[data-cy="button_saveVacancy1"]').contains('Разместить резюме').click()
    cy.url().should('contain', 'http://arbi.local.glob-com.ru:3088/profile?page=cvs')
    cy.contains('Продуктовый аналитик')
  })
})