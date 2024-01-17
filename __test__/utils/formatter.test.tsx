import Formatter from '../../utils/formatter'

describe('Formatter.fulltimeLime', () => {
  it('show 1 month if dates gap is 1', () => {
    expect(Formatter.fullTimeLine([['01.2020', '02.2020']])).toBe('1 месяц')
  })

  it('show 1 month if dates are equal', () => {
    expect(Formatter.fullTimeLine([['01.2020', '01.2020']])).toBe('1 месяц')
  })

  it('show 1 year if dates gap is 12', () => {
    expect(Formatter.fullTimeLine([['01.2020', '01.2021']])).toBe('1 год')
  })

  it('show 1 year 2 months if 1 of more then 1 element', ()=> {
    expect(Formatter.fullTimeLine([['01.2020', '03.2021']])).toBe('1 год 2 месяца')
    expect(Formatter.fullTimeLine([['01.2020', '03.2020'], ['03.2020', '03.2021']])).toBe('1 год 2 месяца')
    expect(Formatter.fullTimeLine([['01.2020', '03.2020'], ['03.2020', '06.2020'], ['06.2020', '03.2021']])).toBe('1 год 2 месяца')
  })

  it('show 4 months if parallel dates', ()=> {
    expect(Formatter.fullTimeLine([['01.2020', '03.2020'], ['01.2020', '03.2020']])).toBe('4 месяца')
  })

  it('show 2 months if we have 2 dates with 1 month gap between', ()=> {
    expect(Formatter.fullTimeLine([['01.2020', '02.2020'], ['01.2021', '02.2021']])).toBe('2 месяца')
  })
})

describe('Formatter.formatPrice', ()=> {
  it('formatPrice', () => {
    expect(Formatter.formatPrice(100)).toBe('100 ₽')
  })
})

describe('Formatter.formatToShortYear', () => {
  it('recieve new Date object', () => {
    expect(Formatter.formatToShortYear(new Date('2020-01-01 00:00'))).toBe('01.01.20 00:00')
  })

  it('recieve string', () => {
    expect(Formatter.formatToShortYear('2020-01-01 00:00')).toBe('01.01.20 00:00')
  })

  it('recieve null', () => {
    expect(Formatter.formatToShortYear(null)).toBe('')
  })
})

describe('Formatter.formatSecondsToTime', () => {
  it('should be HH:mm:ss type hour', () => {
    expect(Formatter.formatSecondsToTime(3600)).toBe('01:00:00')
  }) 

  it('should be HH:mm:ss type minute', () => {
    expect(Formatter.formatSecondsToTime(60)).toBe('01:00')
  })

  it('more then 60 seconds', () => {
    expect(Formatter.formatSecondsToTime(64)).toBe('01:04')
  })

  it('should be 00:00:00 if recieve falsy value', () => {
    expect(Formatter.formatSecondsToTime(null)).toBe('00:00')
    expect(Formatter.formatSecondsToTime(undefined)).toBe('00:00')
    expect(Formatter.formatSecondsToTime(0)).toBe('00:00')
  })
})

describe('Formatter.hideSomePhoneNumbers', () => {
  it('should return +7 999 ***-**-99', () => {
    expect(Formatter.hideSomePhoneNumbers('+7 999 999 99 99')).toBe('+7 999 *** ** 99')
  })

  it('should work with foreign phone', () => {
    expect(Formatter.hideSomePhoneNumbers('+62 811 99 99 99')).toBe('+62 811 ** ** 99')
  })
})

describe('Formatter.formatPhone', () => {
  it('should formar Russian phone', ()=> {
    expect(Formatter.formatPhone('+79999999999')).toBe('+7 999 999-99-99')
  })

  it('should format foreign wright phone', () => {
    expect(Formatter.formatPhone('+628119999999')).toBe('+62 811-9999-999')
  })

  it('should format invalid foreign phone', () => {
    expect(Formatter.formatPhone('+6299999999')).toBe('+62 999 99999')
  })

  it('should format invalid russian phone', () => {
    expect(Formatter.formatPhone('+7999999999')).toBe('+7 999999999')
  })

  it('should return empty string if phone is empty', () => {
    expect(Formatter.formatPhone('')).toBe('')
    expect(Formatter.formatPhone(null)).toBe('')
    expect(Formatter.formatPhone(undefined)).toBe('')
  })
})
