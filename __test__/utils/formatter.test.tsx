import Formatter from '../../utils/formatter'

describe('Formatter', () => {
  it('formatPrice', () => {
    expect(Formatter.formatPrice(100)).toBe('100 ₽')
  })

  it('show 1 month if dates are equal', () => {
    expect(Formatter.fullTimeLine([['01.2020', '01.2020']])).toBe('1 месяц')
  })

  it('show 1 month if dates gap is 1', () => {
    expect(Formatter.fullTimeLine([['01.2020', '02.2020']])).toBe('1 месяц')
  })

  it('show 1 year if dates gap is 12', () => {
    expect(Formatter.fullTimeLine([['01.2020', '01.2021']])).toBe('1 год')
  })

  it('show 2 months if we have 2 dates with 1 month gap between', ()=> {
    expect(Formatter.fullTimeLine([['01.2020', '02.2020'], ['01.2021', '02.2021']])).toBe('2 месяца')
  })
})