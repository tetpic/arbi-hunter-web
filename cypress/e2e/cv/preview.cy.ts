describe('show all data in preview if cv already exists', ()=> {
  const token1 ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUxLCJlbWFpbCI6IjEyMzQyMzQyMzQyQGFtZXJpY2EuYXUiLCJwaG9uZSI6IisxMjM0MjM0MjM0MiIsImlhdCI6MTcwOTczOTUyNCwiZXhwIjoxNzQxMzAyNTI0fQ.cowmrdd42io67Sc4RhS_gAxfbEhPqt3_vh_PGmtP9a8'
  const token2 ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDAwLCJlbWFpbCI6ImJ1bGwxNjA0QGdtYWlsLmNvbSIsInBob25lIjoiKzc5MjY5NjI3MjAyIiwiaWF0IjoxNzA5NzI1OTk3LCJleHAiOjE3NDEyODg5OTd9.0_P4pq8VD6b9Ov2KEdfA8euPtLnOIcNlCIoJp2D2Irs'
  const host = 'http://arbi.local.glob-com.ru:3088/'
  const cvId = '1070'
  it('should show all set data in preview', () => {
    cy.setCookie('accessToken', token2)
    cy.setCookie('profile-type', 'employee')
    cy.visit(host+`create/cv?id=${cvId}&progress=1`)
    cy.contains('SEO - специалист')
    cy.get('[data-cy="button_next"]', {timeout: 5000}).as('nextButton')
    cy.get('[data-cy="button_saveAndNext"]').click()

    cy.get('[data-cy="input_firstName"] input').should('have.value', 'Никита')
    cy.get('[data-cy="input_lastName"] input').should('have.value', 'Быков')
    cy.get('[data-cy="input_patronymic"] input').should('have.value', 'Ильич')
    cy.get('[data-cy="radio_male"]').should('have.data', 'active', true)
    cy.get('[data-cy="input_birthday"] input').should('have.value', '15.04.1992')
    cy.get('#phone-field input').should('have.value', '+7 926 962 72 02')
    cy.get('[data-cy="input_email"] input').should('have.value', 'bull1604@gmail.com')
    cy.get('[data-cy="input_telegramNickname"] input').should('have.value', '@rabustes')
    cy.get('[data-cy="input_whatsapp"] input').should('have.value', 'whatsAppLink')
    cy.get('[data-cy="input_linkedin"] input').should('have.value', 'linkedInLink')
    cy.get('[data-cy="input_viber"] input').should('have.value', 'viberLink')
    cy.get('[data-cy="input_skype"] input').should('have.value', 'skypeLink')
    cy.contains('text about')
    cy.get('@nextButton').click()

    cy.get('[data-cy="radioList_workExperiencePresense"]').get('[data-cy="radio_present"]').should('have.data', 'active', true)
    cy.contains('test')
    cy.contains('01.2016')
    cy.get('@nextButton').click()

    cy.get('[data-cy="radio_doctor"]').should('have.data', 'active', true)
    cy.contains('testUniversity')
    cy.get('@nextButton').click()

    cy.contains('C++')
    cy.contains('Meta (Facebook)')
    cy.contains('Tier 3')
    cy.contains('E-commerce')
    cy.contains('английский, начинающий')
    cy.contains('https://stamina-online.com/ru/lessons/en#words')
    cy.get('@nextButton').click()

    cy.get('[data-cy="radio_fullTime"]').should('have.data', 'active', true)
    cy.get('[data-cy="radio_flexible"]').should('have.data', 'active', true)
    cy.get('[data-cy="radioList_relocation"]').get('[data-cy="radio_yes"]').should('have.data', 'active', true)
    cy.get('[data-cy="radioList_businessTrips"]').get('[data-cy="radio_yes"]').should('have.data', 'active', true)
    cy.get('@nextButton').click()

    cy.get('[data-cy="button_preview"').click()

    cy.contains('Никита')
    cy.contains('Быков')
    cy.contains('Ильич')

    cy.contains('20 000 $')
    cy.contains('Оклад')
    cy.contains('SEO - специалист')
    cy.contains('Мужчина')

    cy.contains('Полная')
    cy.contains('Гибкий график')
    cy.contains('Переезд возможен')
    cy.contains('Командировки возможны')

    cy.contains('Опыт работы')
    cy.contains('01.2016')

    cy.contains('31 год')
    cy.contains('+7 926 962-72-02')
    cy.contains('bull1604@gmail.com')
    cy.contains('@rabustes')
    cy.contains('whatsAppLink')
    cy.contains('linkedInLink')
    // need viber icon 

    //cy.contains('viberLink')
    cy.contains('skypeLink')
    cy.contains('text about')

    cy.contains('Доктор наук')

    cy.contains('C++')
    cy.contains('Meta (Facebook)')
    cy.contains('Tier 3')
    cy.contains('E-commerce')
    cy.contains('Английский, начинающий')
    cy.contains('https://stamina-online.com/ru/lessons/en#words')
  })
  
})